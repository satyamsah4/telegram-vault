import { httpRouter } from "convex/server";
import { auth } from "./auth";
import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

auth.addHttpRoutes(http);

/**
 * The app runs on a different origin than the Convex deployment, so every
 * response coming off this router carries permissive CORS headers. Responses
 * only ever contain bytes the caller already unlocked with a download token.
 */
const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function textResponse(status: number, body: string): Response {
  return new Response(body, {
    status,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

/**
 * `GET /file/:token/:index` — streams one 18 MB part of a stored file.
 *
 * Parts, not whole files, because Telegram only serves back files up to 20 MB
 * while the browser reassembles the pieces. Streaming keeps the response well
 * inside the memory limits instead of buffering the part first.
 */
const downloadPart = httpAction(async (ctx, request) => {
  const { pathname } = new URL(request.url);
  const [, route, token, indexPart] = pathname.split("/");
  if (route !== "file" || !token) return textResponse(404, "Not found");

  const index = Number(indexPart);
  if (!Number.isInteger(index) || index < 0) {
    return textResponse(400, "Bad part index");
  }

  const part = await ctx.runQuery(internal.vault.resolveDownload, {
    token,
    index,
  });
  if (!part) {
    return textResponse(410, "This download link has expired.");
  }

  // file_path is only guaranteed fresh for an hour, so ask for it every time.
  let filePath: string | undefined;
  try {
    const meta = (await fetch(
      `https://api.telegram.org/bot${part.botToken}/getFile?file_id=${encodeURIComponent(
        part.telegramFileId,
      )}`,
    ).then((res) => res.json())) as {
      ok: boolean;
      result?: { file_path?: string };
      description?: string;
    };
    if (meta.ok) filePath = meta.result?.file_path;
  } catch {
    filePath = undefined;
  }
  if (!filePath) {
    return textResponse(502, "Telegram could not produce this file.");
  }

  const upstream = await fetch(
    `https://api.telegram.org/file/bot${part.botToken}/${filePath}`,
  );
  if (!upstream.ok || !upstream.body) {
    return textResponse(502, "Telegram could not serve this file.");
  }

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = upstream.body!.getReader();
      try {
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          controller.enqueue(value);
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="part-${index}"`,
      "Cache-Control": "private, max-age=0",
    },
  });
});

http.route({ path: "/file/:token/:index", method: "GET", handler: downloadPart });

http.route({
  path: "/file/:token/:index",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }),
});

export default http;
