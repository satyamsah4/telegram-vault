import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { errorMessage } from "@/lib/errors";
import { formatBytes, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  Download,
  File as FileIcon,
  FileCode,
  FileArchive,
  FileText,
  Film,
  Folder,
  Image,
  Loader2,
  MoreHorizontal,
  Move,
  Music,
  Pencil,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";

/** A file as the list sees it — its Telegram parts never leave the server. */
export type ListedFile = Omit<Doc<"files">, "parts">;

function iconForFile(name: string) {
  const extension = name.split(".").pop()?.toLowerCase() ?? "";
  if (["png", "jpg", "jpeg", "gif", "webp", "svg", "heic", "avif", "bmp"].includes(extension)) {
    return Image;
  }
  if (["mp4", "mov", "mkv", "webm", "avi", "m4v"].includes(extension)) {
    return Film;
  }
  if (["mp3", "wav", "flac", "aac", "m4a", "ogg"].includes(extension)) {
    return Music;
  }
  if (["zip", "rar", "7z", "tar", "gz", "bz2"].includes(extension)) {
    return FileArchive;
  }
  if (["js", "ts", "tsx", "jsx", "py", "go", "rs", "java", "html", "css", "json", "sh"].includes(extension)) {
    return FileCode;
  }
  if (["pdf", "txt", "md", "doc", "docx", "rtf", "csv", "xlsx", "ppt", "pptx"].includes(extension)) {
    return FileText;
  }
  return FileIcon;
}

const ROW_ACTIONS =
  "grid size-8 shrink-0 place-items-center rounded-md text-muted-foreground transition-opacity hover:bg-accent focus-visible:opacity-100 data-[state=open]:opacity-100 group-hover:opacity-100";

export function FileList({
  folders,
  files,
  downloads,
  onOpenFolder,
  onDownload,
  onNewFolder,
  onUpload,
  onRenameFolder,
  onMoveFolder,
  onDeleteFolder,
  onRenameFile,
  onMoveFile,
  onDeleteFile,
}: {
  folders: Doc<"folders">[];
  files: ListedFile[];
  downloads: Record<string, { done: number; total: number }>;
  onOpenFolder: (id: Id<"folders">) => void;
  onDownload: (file: ListedFile) => Promise<void>;
  onNewFolder: () => void;
  onUpload: () => void;
  onRenameFolder: (folder: Doc<"folders">) => void;
  onMoveFolder: (folder: Doc<"folders">) => void;
  onDeleteFolder: (folder: Doc<"folders">) => void;
  onRenameFile: (file: ListedFile) => void;
  onMoveFile: (file: ListedFile) => void;
  onDeleteFile: (file: ListedFile) => void;
}) {
  if (folders.length === 0 && files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 px-6 py-20 text-center">
        <div className="grid size-14 place-items-center rounded-2xl bg-[var(--brand-soft)] text-[var(--brand-soft-foreground)]">
          <Folder className="size-6" />
        </div>
        <div className="space-y-1.5">
          <p className="text-base font-medium tracking-[-0.01em]">
            This folder is empty
          </p>
          <p className="mx-auto max-w-sm text-sm leading-6 text-muted-foreground">
            Drop files anywhere in this window, or use the buttons above. They
            land in Telegram a few seconds later.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button size="sm" onClick={onUpload}>
            <Upload className="mr-2 size-4" />
            Upload files
          </Button>
          <Button size="sm" variant="outline" onClick={onNewFolder}>
            <Plus className="mr-2 size-4" />
            New folder
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border/60">
      <div className="hidden items-center gap-3 bg-muted/50 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground sm:flex">
        <span className="flex-1">Name</span>
        <span className="w-24 shrink-0 text-right">Size</span>
        <span className="hidden w-32 shrink-0 text-right md:block">Modified</span>
        <span className="w-8 shrink-0" />
      </div>

      {folders.map((folder) => (
        <div
          key={folder._id}
          className="group flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-accent/70"
        >
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[var(--brand-soft)] text-[var(--brand-soft-foreground)]">
            <Folder className="size-4" />
          </span>
          <button
            type="button"
            onClick={() => onOpenFolder(folder._id)}
            className="min-w-0 flex-1 truncate text-left text-sm font-medium tracking-[-0.005em] transition-colors hover:text-[var(--brand)]"
          >
            {folder.name}
          </button>
          <span className="hidden w-24 shrink-0 text-right font-mono-nums text-xs text-muted-foreground sm:block">
            —
          </span>
          <span className="hidden w-32 shrink-0 text-right text-xs text-muted-foreground md:block">
            {formatDate(folder.createdAt)}
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label={`Actions for ${folder.name}`}
                className={ROW_ACTIONS}
              >
                <MoreHorizontal className="size-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={() => onOpenFolder(folder._id)}>
                <Folder className="mr-2 size-4" />
                Open
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onRenameFolder(folder)}>
                <Pencil className="mr-2 size-4" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onMoveFolder(folder)}>
                <Move className="mr-2 size-4" />
                Move to…
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => onDeleteFolder(folder)}
              >
                <Trash2 className="mr-2 size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}

      {files.map((file) => {
        const Icon = iconForFile(file.name);
        const download = downloads[file._id];
        const uploading = file.status === "uploading";
        return (
          <div
            key={file._id}
            className="group flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-accent/70"
          >
            <span
              className={cn(
                "grid size-8 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground",
                uploading && "text-[var(--brand)]",
              )}
            >
              {download ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Icon className="size-4" />
              )}
            </span>
            <button
              type="button"
              disabled={uploading}
              title={uploading ? "Still uploading" : `Download ${file.name}`}
              onClick={() => onDownload(file).catch((error) => console.error(errorMessage(error)))}
              className="min-w-0 flex-1 truncate text-left text-sm tracking-[-0.005em] transition-colors hover:text-[var(--brand)] disabled:cursor-default disabled:hover:text-foreground"
            >
              {file.name}
              {uploading ? (
                <span className="ml-2 text-xs text-muted-foreground">
                  uploading…
                </span>
              ) : null}
              {download && download.total > 0 ? (
                <span className="ml-2 font-mono-nums text-xs text-muted-foreground">
                  {download.done}/{download.total}
                </span>
              ) : null}
            </button>
            <span className="hidden w-24 shrink-0 text-right font-mono-nums text-xs text-muted-foreground sm:block">
              {uploading ? "—" : formatBytes(file.size)}
            </span>
            <span className="hidden w-32 shrink-0 text-right text-xs text-muted-foreground md:block">
              {formatDate(file.createdAt)}
            </span>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label={`Actions for ${file.name}`}
                  className={ROW_ACTIONS}
                >
                  <MoreHorizontal className="size-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem
                  disabled={uploading}
                  onClick={() =>
                    onDownload(file).catch((error) =>
                      console.error(errorMessage(error)),
                    )
                  }
                >
                  <Download className="mr-2 size-4" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onRenameFile(file)}>
                  <Pencil className="mr-2 size-4" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onMoveFile(file)}>
                  <Move className="mr-2 size-4" />
                  Move to…
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => onDeleteFile(file)}
                >
                  <Trash2 className="mr-2 size-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      })}
    </div>
  );
}
