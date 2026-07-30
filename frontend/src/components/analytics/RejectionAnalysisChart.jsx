// components/analytics/RejectionAnalysisChart.jsx
const REASON_COLORS = {
  DSA: "var(--color-coral)",
  Communication: "var(--color-gold)",
  Resume: "var(--color-teal)",
  "System Design": "var(--color-slate)",
  Projects: "var(--color-muted)",
  Unknown: "var(--color-border)",
};

export default function RejectionAnalysisChart({ rejectionBreakdown }) {
  const entries = Object.entries(rejectionBreakdown ?? {});
  const total = entries.reduce((sum, [, count]) => sum + count, 0);

  if (total === 0) {
    return (
      <p className="text-muted text-sm">
        No rejection data yet. Once you mark applications as Rejected with a reason, patterns will show up here.
      </p>
    );
  }

  const sorted = [...entries].sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-3">
      {sorted.map(([reason, count]) => {
        const percentage = Math.round((count / total) * 100);
        return (
          <div key={reason} className="flex items-center gap-3">
            <span className="text-muted text-xs w-32 flex-shrink-0">{reason}</span>
            <div className="flex-1 h-2 bg-panel-2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: REASON_COLORS[reason] ?? "var(--color-slate)",
                }}
              />
            </div>
            <span className="text-text text-sm font-semibold w-12 text-right">{percentage}%</span>
          </div>
        );
      })}
    </div>
  );
}