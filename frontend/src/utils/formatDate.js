// utils/formatDate.js

/**
 * Formats a date string/object into a readable format.
 * Example: "12 Jul 2026"
 */
export function formatDate(date) {
  if (!date) return "—";

  const d = new Date(date);
  if (isNaN(d.getTime())) return "—";

  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Formats a date with time.
 * Example: "12 Jul 2026, 4:30 PM"
 */
export function formatDateTime(date) {
  if (!date) return "—";

  const d = new Date(date);
  if (isNaN(d.getTime())) return "—";

  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Returns a relative "time ago" string.
 * Example: "2h ago", "3d ago", "just now"
 */
export function timeAgo(date) {
  if (!date) return "";

  const diffMs = Date.now() - new Date(date).getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths}mo ago`;

  const diffYears = Math.floor(diffMonths / 12);
  return `${diffYears}y ago`;
}

/**
 * Formats an interview date for display in cards.
 * Example: "Today, 3:00 PM", "Tomorrow, 11:00 AM", "Fri, 3:00 PM", "Jul 14"
 */
export function formatInterviewDate(date) {
  if (!date) return "—";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "—";

  const now = new Date();
  const dCopy = new Date(date);
  const diffDays = Math.floor(
    (dCopy.setHours(0, 0, 0, 0) - now.setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24)
  );

  const weekday = d.toLocaleDateString("en-IN", { weekday: "short" });
  const time = new Date(date).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (diffDays === 0) return `Today, ${time}`;
  if (diffDays === 1) return `Tomorrow, ${time}`;
  if (diffDays > 1 && diffDays < 7) return `${weekday}, ${time}`;

  return d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
}