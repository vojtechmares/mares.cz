/**
 * Truncate a description string to fit within a max character limit.
 * If the text exceeds maxLength, it is truncated and "..." is appended.
 */
export function truncateDescription(text: string, maxLength: number = 160): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

/**
 * Format course duration as an ISO 8601 duration string.
 * Assumes 8 hours per training day.
 */
export function formatCourseTimeRequired(lengthDays: number): string {
  return `PT${lengthDays * 8}H`;
}
