import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { useAction, useMutation } from "convex/react";
import { CHUNK_BYTES, MAX_NAME_LENGTH } from "./constants";
import { convexSiteUrl } from "./convex-site";

export interface UploadState {
  key: string;
  fileId: Id<"files"> | null;
  name: string;
  size: number;
  loaded: number;
  chunkIndex: number;
  chunkCount: number;
  phase: "uploading" | "storing" | "done" | "error";
  error?: string;
}

export type UploadPatch = Partial<Omit<UploadState, "key">>;

interface SaveFilePicker {
  showSaveFilePicker?: (options: {
    suggestedName?: string;
  }) => Promise<{
    createWritable: () => Promise<{
      write: (data: Uint8Array) => Promise<void>;
      close: () => Promise<void>;
    }>;
  }>;
}

/** POSTs one part straight into Convex storage, reporting byte progress. */
function postSlice(
  url: string,
  slice: Blob,
  onLoaded: (loaded: number) => void,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("POST", url);
    request.setRequestHeader(
      "Content-Type",
      slice.type || "application/octet-stream",
    );
    request.upload.onprogress = (event) => {
      if (event.lengthComputable) onLoaded(event.loaded);
    };
    request.onload = () => {
      if (request.status >= 200 && request.status < 300) {
        try {
          const { storageId } = JSON.parse(request.responseText) as {
            storageId: string;
          };
          resolve(storageId);
        } catch {
          reject(new Error("The upload finished with an unexpected response."));
        }
      } else {
        reject(new Error(`Storage rejected the upload (${request.status}).`));
      }
    };
    request.onerror = () =>
      reject(new Error("Network error while uploading — check your connection."));
    request.onabort = () => reject(new Error("Upload interrupted."));
    request.send(slice);
  });
}

async function readErrorMessage(response: Response): Promise<string> {
  if (response.status === 410) return "That download link expired — try again.";
  const text = await response.text().catch(() => "");
  return text || `Request failed (${response.status}).`;
}

function triggerBrowserDownload(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

/**
 * Everything that moves bytes: parts are uploaded one at a time (which keeps
 * Telegram's per-chat pacing happy) and downloads stream back part by part.
 */
export function useTransfer() {
  const createFile = useMutation(api.vault.createFile);
  const getChunkUploadUrl = useMutation(api.vault.getChunkUploadUrl);
  const finishUpload = useMutation(api.vault.finishUpload);
  const createDownloadToken = useMutation(api.vault.createDownloadToken);
  const sendChunk = useAction(api.telegram.sendChunk);
  const removeFile = useAction(api.telegram.removeFile);

  async function uploadFile({
    file,
    folderId,
    onPatch,
  }: {
    file: File;
    folderId: Id<"folders"> | null;
    onPatch: (patch: UploadPatch) => void;
  }): Promise<Id<"files">> {
    const name = file.name.slice(0, MAX_NAME_LENGTH) || "untitled";
    const { fileId, chunkCount } = await createFile({
      name,
      size: file.size,
      mimeType: file.type || "application/octet-stream",
      folderId,
    });
    onPatch({ fileId, name, size: file.size, chunkCount });

    let confirmed = 0;
    try {
      for (let index = 0; index < chunkCount; index++) {
        const start = index * CHUNK_BYTES;
        const slice = file.slice(start, Math.min(start + CHUNK_BYTES, file.size));
        onPatch({ phase: "uploading", chunkIndex: index, loaded: confirmed });

        const uploadUrl = await getChunkUploadUrl({ fileId, index });
        const storageId = await postSlice(uploadUrl, slice, (loaded) =>
          onPatch({ loaded: confirmed + Math.min(loaded, slice.size) }),
        );

        onPatch({ phase: "storing", chunkIndex: index, loaded: confirmed });
        await sendChunk({ fileId, index, storageId });
        confirmed += slice.size;
        onPatch({ loaded: confirmed });
      }

      await finishUpload({ fileId });
      onPatch({ phase: "done", loaded: file.size });
      return fileId;
    } catch (error) {
      // Never leave a half-written record (or its parts) behind.
      await removeFile({ fileId }).catch(() => {});
      throw error;
    }
  }

  async function downloadFile(
    file: Pick<Doc<"files">, "_id" | "name" | "mimeType" | "chunkCount">,
    onProgress: (done: number, total: number) => void,
  ): Promise<void> {
    if (file.chunkCount === 0) {
      triggerBrowserDownload(
        new Blob([], { type: file.mimeType || "application/octet-stream" }),
        file.name,
      );
      onProgress(0, 0);
      return;
    }

    const token = await createDownloadToken({ fileId: file._id });
    const site = convexSiteUrl();
    if (!site) throw new Error("This deployment has no download endpoint.");
    const partUrl = (index: number) => `${site}/file/${token}/${index}`;

    // Prefer streaming straight to disk so large files never sit in memory.
    const picker = (window as unknown as SaveFilePicker).showSaveFilePicker;
    if (typeof picker === "function") {
      try {
        const handle = await picker({ suggestedName: file.name });
        const writable = await handle.createWritable();
        for (let index = 0; index < file.chunkCount; index++) {
          const response = await fetch(partUrl(index));
          if (!response.ok || !response.body) {
            throw new Error(await readErrorMessage(response));
          }
          const reader = response.body.getReader();
          for (;;) {
            const { value, done } = await reader.read();
            if (done) break;
            await writable.write(value);
          }
          onProgress(index + 1, file.chunkCount);
        }
        await writable.close();
        return;
      } catch (error) {
        // The user closing the save dialog is a real cancel; anything else
        // falls back to assembling the file in the tab.
        if ((error as { name?: string })?.name === "AbortError") throw error;
      }
    }

    const parts: Blob[] = [];
    for (let index = 0; index < file.chunkCount; index++) {
      const response = await fetch(partUrl(index));
      if (!response.ok) throw new Error(await readErrorMessage(response));
      parts.push(await response.blob());
      onProgress(index + 1, file.chunkCount);
    }
    triggerBrowserDownload(
      new Blob(parts, { type: file.mimeType || "application/octet-stream" }),
      file.name,
    );
  }

  /** Removes a file from the vault and, best effort, from the Telegram chat. */
  async function deleteFile(fileId: Id<"files">): Promise<void> {
    await removeFile({ fileId });
  }

  return { uploadFile, downloadFile, deleteFile };
}
