// components/analytics/ApplicationsChart.jsx
export default function ApplicationsChart({ data }) {
  if (!data || data.length === 0) {
    return <p className="text-muted text-sm">No application data yet.</p>;
  }

  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="space-y-3">
      {data.slice(0, 8).map((item) => (
        <div key={item.companyId ?? item.companyName} className="flex items-center gap-3">
          <span className="text-muted text-xs w-32 flex-shrink-0 truncate">
            {item.companyName ?? "Unknown"}
          </span>
          <div className="flex-1 h-2 bg-panel-2 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gold"
              style={{ width: `${(item.count / maxCount) * 100}%` }}
            />
          </div>
          <span className="text-text text-sm font-semibold w-8 text-right">{item.count}</span>
        </div>
      ))}
    </div>
  );
}