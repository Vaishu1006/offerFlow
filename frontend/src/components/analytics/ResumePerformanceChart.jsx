// components/analytics/ResumePerformanceChart.jsx
export default function ResumePerformanceChart({ resumeStats }) {
  const entries = Object.entries(resumeStats ?? {});

  if (entries.length === 0) {
    return (
      <p className="text-muted text-sm">
        No resume performance data yet. Once you apply using different resume categories, comparisons will show up here.
      </p>
    );
  }

  // Sort by applied count, descending — most-used resume first
  const sorted = [...entries].sort((a, b) => b[1].applied - a[1].applied);

  return (
    <div className="grid grid-cols-2 gap-4">
      {sorted.map(([category, { applied, interviewCalls }]) => {
        const conversionRate = applied > 0 ? Math.round((interviewCalls / applied) * 100) : 0;
        return (
          <div
            key={category}
            className="bg-panel-2 border border-border rounded-xl p-5"
          >
            <p className="text-text font-semibold mb-3">{category}</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Applied</span>
                <span className="text-text font-medium">{applied}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Interview Calls</span>
                <span className="text-text font-medium">{interviewCalls}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border">
                <span className="text-muted">Conversion Rate</span>
                <span
                  className={`font-semibold ${
                    conversionRate >= 40
                      ? "text-gold"
                      : conversionRate >= 15
                      ? "text-teal"
                      : "text-coral"
                  }`}
                >
                  {conversionRate}%
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}