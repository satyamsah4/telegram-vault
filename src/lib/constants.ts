/**
 * Shared constants for the transfer pipeline.
 *
 * Files are split into parts before they reach Telegram because the Bot API
 * can upload 50 MB per request but only serves back files up to 20 MB.
 * 18 MB parts sit safely under both limits, which is what makes the vault
 * able to hold files of any size on a chat that has no quota at all.
 */
export const CHUNK_BYTES = 18 * 1024 * 1024;

/** Longest folder / file name we accept. */
export const MAX_NAME_LENGTH = 200;

/** How long a download link stays valid. */
export const DOWNLOAD_TOKEN_TTL_MS = 30 * 60 * 1000;
