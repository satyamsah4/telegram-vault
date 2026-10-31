import { format, isToday, isYesterday } from "date-fns";

const UNITS = ["B", "KB", "MB", "GB", "TB", "PB"];

/** 1536 → "1.5 KB" */
export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "—";
  if (bytes === 0) return "0 B";
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    UNITS.length - 1,
  );
  const value = bytes / 1024 ** exponent;
  const decimals = exponent === 0 ? 0 : value >= 100 ? 0 : value >= 10 ? 1 : 2;
  return `${value.toFixed(decimals)} ${UNITS[exponent]}`;
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  if (isToday(date)) return `Today, ${format(date, "HH:mm")}`;
  if (isYesterday(date)) return "Yesterday";
  return format(date, "d MMM yyyy");
}

export function formatPercent(loaded: number, total: number): number {
  if (total <= 0) return 100;
  return Math.min(100, Math.max(0, Math.round((loaded / total) * 100)));
}
