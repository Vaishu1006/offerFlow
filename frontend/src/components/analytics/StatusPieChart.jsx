// components/analytics/StatusPieChart.jsx
const STATUS_COLOR = {
  Saved: "var(--color-muted)",
  Applied: "var(--color-slate)",
  "OA Scheduled": "var(--color-teal)",
  "OA Cleared": "var(--color-teal)",
  "Interview Round 1": "var(--color-teal)",
  "Interview Round 2": "var(--color-teal)",
  "HR Round": "var(--color-teal)",
  Selected: "var(--color-gold)",
  Rejected: "var(--color-coral)",
};

// components/analytics/StatusPieChart.jsx
export default function StatusPieChart({ statusBreakdown }) {
  const total = statusBreakdown.reduce((sum, s) => sum + s.count, 0);
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  if (total === 0) {
    return (
      <svg viewBox="0 0 160 160" className="w-40 h-40 -rotate-90">
        <circle cx="80" cy="80" r={radius} fill="none" stroke="var(--color-border)" strokeWidth="20" />
      </svg>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
      <svg viewBox="0 0 160 160" className="w-36 h-36 -rotate-90 flex-shrink-0">
        {statusBreakdown.map((item) => {
          const fraction = item.count / total;
          const dash = fraction * circumference;
          const circle = (
            <circle
              key={item._id}
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke={STATUS_COLOR[item._id] ?? "var(--color-slate)"}
              strokeWidth="20"
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
            />
          );
          offset += dash;
          return circle;
        })}
      </svg>

      <ul className="space-y-2 min-w-0 w-full">
        {statusBreakdown.map((item) => (
          <li key={item._id} className="flex items-center gap-2 text-sm">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: STATUS_COLOR[item._id] ?? "var(--color-slate)" }}
            />
            <span className="text-text truncate">{item._id}</span>
            <span className="text-muted flex-shrink-0 ml-auto">{item.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
