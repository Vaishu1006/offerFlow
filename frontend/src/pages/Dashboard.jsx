// pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { getMyStats } from "../api/analyticsApi";
import { timeAgo } from "../utils/formatDate";
import ApplicationForm from "../components/application/ApplicationForm";

const STATUS_COLORS = {
  Selected: "var(--color-gold)",
  Interview: "var(--color-teal)",
  Applied: "var(--color-slate)",
  Rejected: "var(--color-coral)",
};

const NOTIF_TYPE_COLOR = {
  interview_scheduled: "var(--color-teal)",
  interview_updated: "var(--color-teal)",
  interview_cancelled: "var(--color-coral)",
  interview_reminder: "var(--color-gold)",
  application_status_changed: "var(--color-slate)",
  follow_up_reminder: "var(--color-slate)",
  oa_deadline_today: "var(--color-coral)",
  general: "var(--color-slate)",
};

const INTERVIEW_STAGE_KEYS = [
  "OA Scheduled",
  "OA Cleared",
  "Interview Round 1",
  "Interview Round 2",
  "HR Round",
];

function StatCard({ label, value, delta, deltaPositive }) {
  return (
    <div className="bg-panel border border-border rounded-2xl p-6">
      <p className="text-3xl font-bold text-text">{value}</p>
      <p className="text-muted text-sm mt-1">{label}</p>
      {delta && (
        <p className={`text-xs mt-3 ${deltaPositive ? "text-teal" : "text-coral"}`}>
          {deltaPositive ? "↑" : "↓"} {delta}
        </p>
      )}
    </div>
  );
}

function DonutChart({ segments }) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
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
    <svg viewBox="0 0 160 160" className="w-40 h-40 -rotate-90">
      {segments.map((seg) => {
        const fraction = seg.value / total;
        const dash = fraction * circumference;
        const circle = (
          <circle
            key={seg.label}
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke={seg.color}
            strokeWidth="20"
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeDashoffset={-offset}
          />
        );
        offset += dash;
        return circle;
      })}
    </svg>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm]=useState(false);

  useEffect(() => {
    alert("Dashboard");
    async function loadDashboard() {
      try {
        const response = await getMyStats();
        if (response.success) {
          setStats(response.stats);
        } else {
          setError(response.message || "Failed to load stats");
        }
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  function handleApplicationCreated(){
    setLoading(true);
    getMyStats().then((response)=>{
      if (response.success) setStats(response.stats);
      setLoading(false);
    });
  }
  if (loading) return <p className="text-muted">Loading...</p>;
  if (error) return <p className="text-coral">{error}</p>;

  const statusCount = stats?.statusCount ?? {};
  const selectedCount = statusCount["Selected"] ?? 0;
  const appliedCount = statusCount["Applied"] ?? 0;
  const rejectedCount = statusCount["Rejected"] ?? 0;
  const interviewCount = INTERVIEW_STAGE_KEYS.reduce(
    (sum, key) => sum + (statusCount[key] ?? 0),
    0
  );

  const statusBreakdown = [
    { label: "Selected", value: selectedCount, color: STATUS_COLORS.Selected },
    { label: "Interview", value: interviewCount, color: STATUS_COLORS.Interview },
    { label: "Applied", value: appliedCount, color: STATUS_COLORS.Applied },
    { label: "Rejected", value: rejectedCount, color: STATUS_COLORS.Rejected },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text">Dashboard</h1>
          <p className="text-muted text-sm mt-1">Your job hunt, at a glance.</p>
        </div>
        <button onClick={()=> setShowForm(true)} className="bg-gold hover:opacity-90 text-gold-ink font-semibold text-sm px-4 py-2.5 rounded-lg transition">
          + Add Application
        </button>
      </div>

      <div className="grid grid-cols-4 gap-5 mb-6">
        <StatCard label="Total Applied" value={stats?.totalApplications ?? 0} />
        <StatCard label="Active Interviews" value={stats?.activeInterviews ?? 0} />
        <StatCard label="Selected" value={selectedCount} />
        <StatCard label="Response Rate" value={`${stats?.responseRate ?? 0}%`} />
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 bg-panel border border-border rounded-2xl p-6">
          <h2 className="text-text font-semibold mb-6">Status Breakdown</h2>
          <div className="flex items-center gap-10">
            <DonutChart segments={statusBreakdown} />
            <ul className="space-y-3">
              {statusBreakdown.map((seg) => (
                <li key={seg.label} className="flex items-center gap-2 text-sm">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
                  <span className="text-text">{seg.label} — {seg.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-panel border border-border rounded-2xl p-6">
          <h2 className="text-text font-semibold mb-4">Recent Activity</h2>
          {stats?.recentActivity?.length > 0 ? (
            <ul className="divide-y divide-border">
              {stats.recentActivity.map((item) => (
                <li key={item._id} className="py-3 flex items-start gap-3">
                  <span
                    className="w-2 h-2 rounded-full mt-1.5"
                    style={{ backgroundColor: NOTIF_TYPE_COLOR[item.type] ?? "var(--color-slate)" }}
                  />
                  <div>
                    <p className="text-text text-sm">{item.title}</p>
                    <p className="text-muted text-xs mt-0.5">{timeAgo(item.createdAt)}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted text-sm">No recent activity yet.</p>
          )}
        </div>
      </div>

      {showForm && (
        <ApplicationForm onClose={()=>setShowForm(false)}
        onCreated={handleApplicationCreated}
        />
      )}
    </div>
  );
}