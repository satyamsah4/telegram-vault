/**
 * What kind of file something is, and the content type a browser should be
 * told when serving it.
 *
 * Shared by the HTTP file route (which must hand back a type the browser will
 * render rather than download) and the in-app viewer (which picks a renderer),
 * so it stays pure data with no environment-specific imports.
 */

export type ViewerKind = "image" | "video" | "audio" | "pdf" | "text" | "other";

interface FileKind {
  mime: string;
  kind: ViewerKind;
}

const KIND_BY_EXTENSION: Record<string, FileKind> = {
  // images
  png: { mime: "image/png", kind: "image" },
  jpg: { mime: "image/jpeg", kind: "image" },
  jpeg: { mime: "image/jpeg", kind: "image" },
  gif: { mime: "image/gif", kind: "image" },
  webp: { mime: "image/webp", kind: "image" },
  avif: { mime: "image/avif", kind: "image" },
  svg: { mime: "image/svg+xml", kind: "image" },
  bmp: { mime: "image/bmp", kind: "image" },
  ico: { mime: "image/x-icon", kind: "image" },
  heic: { mime: "image/heic", kind: "image" },
  heif: { mime: "image/heif", kind: "image" },

  // video
  mp4: { mime: "video/mp4", kind: "video" },
  m4v: { mime: "video/x-m4v", kind: "video" },
  webm: { mime: "video/webm", kind: "video" },
  mov: { mime: "video/quicktime", kind: "video" },
  mkv: { mime: "video/x-matroska", kind: "video" },
  avi: { mime: "video/x-msvideo", kind: "video" },
  mpg: { mime: "video/mpeg", kind: "video" },
  mpeg: { mime: "video/mpeg", kind: "video" },

  // audio
  mp3: { mime: "audio/mpeg", kind: "audio" },
  wav: { mime: "audio/wav", kind: "audio" },
  ogg: { mime: "audio/ogg", kind: "audio" },
  oga: { mime: "audio/ogg", kind: "audio" },
  m4a: { mime: "audio/mp4", kind: "audio" },
  flac: { mime: "audio/flac", kind: "audio" },
  aac: { mime: "audio/aac", kind: "audio" },
  opus: { mime: "audio/opus", kind: "audio" },
  wma: { mime: "audio/x-ms-wma", kind: "audio" },

  // documents the browser renders by itself
  pdf: { mime: "application/pdf", kind: "pdf" },

  // plain text and code — shown in the viewer's read pane
  txt: { mime: "text/plain", kind: "text" },
  text: { mime: "text/plain", kind: "text" },
  log: { mime: "text/plain", kind: "text" },
  md: { mime: "text/markdown", kind: "text" },
  markdown: { mime: "text/markdown", kind: "text" },
  csv: { mime: "text/csv", kind: "text" },
  tsv: { mime: "text/tab-separated-values", kind: "text" },
  json: { mime: "application/json", kind: "text" },
  json5: { mime: "application/json", kind: "text" },
  xml: { mime: "application/xml", kind: "text" },
  yml: { mime: "text/yaml", kind: "text" },
  yaml: { mime: "text/yaml", kind: "text" },
  toml: { mime: "text/plain", kind: "text" },
  ini: { mime: "text/plain", kind: "text" },
  cfg: { mime: "text/plain", kind: "text" },
  conf: { mime: "text/plain", kind: "text" },
  env: { mime: "text/plain", kind: "text" },
  html: { mime: "text/html", kind: "text" },
  htm: { mime: "text/html", kind: "text" },
  css: { mime: "text/css", kind: "text" },
  scss: { mime: "text/x-scss", kind: "text" },
  js: { mime: "text/javascript", kind: "text" },
  mjs: { mime: "text/javascript", kind: "text" },
  cjs: { mime: "text/javascript", kind: "text" },
  jsx: { mime: "text/plain", kind: "text" },
  ts: { mime: "text/plain", kind: "text" },
  tsx: { mime: "text/plain", kind: "text" },
  vue: { mime: "text/plain", kind: "text" },
  svelte: { mime: "text/plain", kind: "text" },
  py: { mime: "text/x-python", kind: "text" },
  rb: { mime: "text/x-ruby", kind: "text" },
  go: { mime: "text/x-go", kind: "text" },
  rs: { mime: "text/x-rust", kind: "text" },
  java: { mime: "text/x-java", kind: "text" },
  c: { mime: "text/x-c", kind: "text" },
  h: { mime: "text/x-c", kind: "text" },
  cpp: { mime: "text/x-c++", kind: "text" },
  hpp: { mime: "text/x-c++", kind: "text" },
  cc: { mime: "text/x-c++", kind: "text" },
  cs: { mime: "text/x-csharp", kind: "text" },
  php: { mime: "text/x-php", kind: "text" },
  sh: { mime: "text/x-shellscript", kind: "text" },
  bash: { mime: "text/x-shellscript", kind: "text" },
  zsh: { mime: "text/x-shellscript", kind: "text" },
  fish: { mime: "text/x-shellscript", kind: "text" },
  ps1: { mime: "text/x-powershell", kind: "text" },
  bat: { mime: "text/plain", kind: "text" },
  sql: { mime: "text/x-sql", kind: "text" },
  swift: { mime: "text/x-swift", kind: "text" },
  kt: { mime: "text/x-kotlin", kind: "text" },
  scala: { mime: "text/x-scala", kind: "text" },
  lua: { mime: "text/x-lua", kind: "text" },
  pl: { mime: "text/x-perl", kind: "text" },
  r: { mime: "text/x-r", kind: "text" },
  dart: { mime: "text/x-dart", kind: "text" },
  graphql: { mime: "text/plain", kind: "text" },
  gql: { mime: "text/plain", kind: "text" },
  proto: { mime: "text/plain", kind: "text" },
  tex: { mime: "text/x-tex", kind: "text" },
  gradle: { mime: "text/plain", kind: "text" },
  cmake: { mime: "text/plain", kind: "text" },
  diff: { mime: "text/x-diff", kind: "text" },
  patch: { mime: "text/x-diff", kind: "text" },

  // archives — saved, never rendered
  zip: { mime: "application/zip", kind: "other" },
  rar: { mime: "application/vnd.rar", kind: "other" },
  "7z": { mime: "application/x-7z-compressed", kind: "other" },
  tar: { mime: "application/x-tar", kind: "other" },
  gz: { mime: "application/gzip", kind: "other" },
  bz2: { mime: "application/x-bzip2", kind: "other" },
  xz: { mime: "application/x-xz", kind: "other" },
  zst: { mime: "application/zstd", kind: "other" },
  iso: { mime: "application/x-iso9660-image", kind: "other" },
  epub: { mime: "application/epub+zip", kind: "other" },
  torrent: { mime: "application/x-bittorrent", kind: "other" },

  // office documents
  doc: { mime: "application/msword", kind: "other" },
  docx: {
    mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    kind: "other",
  },
  xls: { mime: "application/vnd.ms-excel", kind: "other" },
  xlsx: {
    mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    kind: "other",
  },
  ppt: { mime: "application/vnd.ms-powerpoint", kind: "other" },
  pptx: {
    mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    kind: "other",
  },
  odt: { mime: "application/vnd.oasis.opendocument.text", kind: "other" },
  rtf: { mime: "application/rtf", kind: "other" },

  // executables and packages
  exe: { mime: "application/vnd.microsoft.portable-executable", kind: "other" },
  apk: { mime: "application/vnd.android.package-archive", kind: "other" },
  deb: { mime: "application/vnd.debian.binary-package", kind: "other" },
  rpm: { mime: "application/x-rpm", kind: "other" },
  wasm: { mime: "application/wasm", kind: "other" },
};

/** Files whose identity is the whole name, not an extension. */
const KIND_BY_NAME: Record<string, FileKind> = {
  dockerfile: { mime: "text/plain", kind: "text" },
  makefile: { mime: "text/plain", kind: "text" },
  license: { mime: "text/plain", kind: "text" },
  licence: { mime: "text/plain", kind: "text" },
  readme: { mime: "text/plain", kind: "text" },
  gemfile: { mime: "text/plain", kind: "text" },
  procfile: { mime: "text/plain", kind: "text" },
  vagrantfile: { mime: "text/plain", kind: "text" },
};

function extensionOf(name: string): string {
  const dot = name.lastIndexOf(".");
  if (dot <= 0 || dot === name.length - 1) return "";
  return name.slice(dot + 1).toLowerCase();
}

function kindFromMime(mime: string): ViewerKind {
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";
  if (mime === "application/pdf") return "pdf";
  if (
    mime.startsWith("text/") ||
    mime === "application/json" ||
    mime === "application/xml" ||
    mime.endsWith("+json")
  ) {
    return "text";
  }
  return "other";
}

/**
 * Extension first (what people name things by), then the bare name, then the
 * type the browser reported at upload time.
 */
function kindFor(name: string, storedMime?: string): FileKind {
  const byName = KIND_BY_NAME[name.trim().toLowerCase()];
  if (byName) return byName;

  const byExtension = KIND_BY_EXTENSION[extensionOf(name)];
  if (byExtension) return byExtension;

  const mime = (storedMime ?? "").trim().toLowerCase();
  if (!mime || mime === "application/octet-stream") {
    return { mime: "application/octet-stream", kind: "other" };
  }
  return { mime, kind: kindFromMime(mime) };
}

/** The content type the HTTP route should serve this file as. */
export function mimeForFile(name: string, storedMime?: string): string {
  return kindFor(name, storedMime).mime;
}

/** Which renderer the in-app viewer should reach for. */
export function viewerKind(name: string, storedMime?: string): ViewerKind {
  return kindFor(name, storedMime).kind;
}
