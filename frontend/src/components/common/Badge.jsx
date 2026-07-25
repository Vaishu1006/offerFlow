// components/common/Badge.jsx
const STATUS_STYLES = {
  Saved: "text-muted border-border bg-panel-2",
  Applied: "text-slate border-slate/40 bg-slate/10",
  "OA Scheduled": "text-teal border-teal/40 bg-teal/10",
  "OA Cleared": "text-teal border-teal/40 bg-teal/10",
  "Interview Round 1": "text-teal border-teal/40 bg-teal/10",
  "Interview Round 2": "text-teal border-teal/40 bg-teal/10",
  "HR Round": "text-teal border-teal/40 bg-teal/10",
  Selected: "text-gold border-gold/40 bg-gold/10",
  Rejected: "text-coral border-coral/40 bg-coral/10",
};

export default function Badge({ status }) {
  return (
    <span
      className={`text-[10px] font-bold tracking-wide uppercase px-2 py-1 rounded-full border whitespace-nowrap ${
        STATUS_STYLES[status] ?? "text-muted border-border"
      }`}
    >
      {status}
    </span>
  );
}