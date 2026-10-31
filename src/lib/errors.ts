/** Normalises server/client errors into something worth showing a person. */
export function errorMessage(error: unknown): string {
  const raw =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "";
  const firstLine = raw.split("\n")[0] ?? "";
  const cleaned = firstLine
    .replace(/^Uncaught (Error|ConvexError):\s*/i, "")
    .replace(/^Error:\s*/i, "")
    .replace(/\s+at\s+.*$/, "")
    .replace(/\s{2,}/g, " ")
    .trim();
  return cleaned || "Something went wrong. Please try again.";
}
