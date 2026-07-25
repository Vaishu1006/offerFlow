// components/analytics/TrendChart.jsx
const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export default function TrendChart({ data }) {
  if (!data || data.length === 0) {
    return <p className="text-muted text-sm">No trend data yet.</p>;
  }

  // Not enough points for a meaningful line — show a simple stat instead
  if (data.length === 1) {
    const point = data[0];
    return (
      <div className="text-center py-8">
        <p className="text-4xl font-bold text-gold">{point.count}</p>
        <p className="text-muted text-sm mt-2">
          applications in {MONTH_NAMES[point._id.month - 1]} {point._id.year}
        </p>
        <p className="text-muted text-xs mt-4">
          Trend line will appear once data spans multiple months.
        </p>
      </div>
    );
  }

  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const width = 600;
  const height = 180;
  const padding = 30;
  const stepX = (width - padding * 2) / Math.max(data.length - 1, 1);

  const points = data.map((d, i) => {
    const x = padding + i * stepX;
    const y = height - padding - (d.count / maxCount) * (height - padding * 2);
    return { x, y, label: `${MONTH_NAMES[d._id.month - 1]} ${d._id.year}`, count: d.count };
  });

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  // Simple Y-axis ticks: 0, half, max
  const yTicks = [0, Math.round(maxCount / 2), maxCount];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44">
      {/* Y-axis grid lines + labels */}
      {yTicks.map((tick) => {
        const y = height - padding - (tick / maxCount) * (height - padding * 2);
        return (
          <g key={tick}>
            <line
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke="var(--color-border)"
              strokeWidth="1"
            />
            <text x={padding - 8} y={y + 3} fontSize="9" fill="var(--color-muted)" textAnchor="end">
              {tick}
            </text>
          </g>
        );
      })}

      <path d={pathD} fill="none" stroke="var(--color-gold)" strokeWidth="2" />
      {points.map((p) => (
        <circle key={p.label} cx={p.x} cy={p.y} r="3.5" fill="var(--color-gold)" />
      ))}
      {points.map((p) => (
        <text
          key={`${p.label}-label`}
          x={p.x}
          y={height - 6}
          fontSize="9"
          fill="var(--color-muted)"
          textAnchor="middle"
        >
          {p.label}
        </text>
      ))}
    </svg>
  );
}