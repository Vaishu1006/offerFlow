// pages/admin/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { getDashboardStats } from "../../api/analyticsApi";
import StatusPieChart from "../../components/analytics/StatusPieChart";
import ApplicationsChart from "../../components/analytics/ApplicationsChart";
import TrendChart from "../../components/analytics/TrendChart";
import { getApplicationsByCompany, getApplicationsTrend } from "../../api/analyticsApi";

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

function StatCard({ label, value }) {
  return (
    <div className="bg-panel border border-border rounded-2xl p-6">
      <p className="text-3xl font-bold text-text">{value}</p>
      <p className="text-muted text-sm mt-1">{label}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [byCompany, setByCompany]=useState([]);
  const [trend, setTrend]=useState([]);

  useEffect(() => {
    async function load() {
      try {
        const [statsRes, companyRes, trendRes] = await Promise.all([
          getDashboardStats(),
          getApplicationsByCompany(),
          getApplicationsTrend(),
        ]);

        if (statsRes.success) setStats(statsRes.stats);
        if (companyRes.success) setByCompany(companyRes.data ?? []);
        if (trendRes.success) setTrend(trendRes.data ?? []);
      } catch (err) {
        
        setError(err?.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p className="text-muted">Loading...</p>;
  if (error) return <p className="text-coral">{error}</p>;

  const statusBreakdown = stats?.statusBreakdown ?? [];
  const maxCount = Math.max(...statusBreakdown.map((s) => s.count), 1);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text">Admin Dashboard</h1>
        <p className="text-muted text-sm mt-1">Platform-wide overview</p>
      </div>

      <div className="grid grid-cols-4 gap-5 mb-6">
        <StatCard label="Total Students" value={stats?.totalStudents ?? 0} />
        <StatCard label="Total Mentors" value={stats?.totalMentors ?? 0} />
        <StatCard label="Total Applications" value={stats?.totalApplications ?? 0} />
        <StatCard label="Total Interviews" value={stats?.totalInterviews ?? 0} />
      </div>

      <div className="grid grid-cols-2 gap-5 mb-6">
        <div className="bg-panel border border-border rounded-2xl p-6">
          <h2 className="text-text font-semibold mb-6">Status Breakdown (All Students)</h2>
          <StatusPieChart statusBreakdown={stats?.statusBreakdown ?? []} />
        </div>

        <div className="bg-panel border border-border rounded-2xl p-6">
            <h2 className="text-text font-semibold mb-6">Applications by Company</h2>
            <ApplicationsChart data={byCompany} />
        </div>
      </div>

      <div className="bg-panel border border-border rounded-2xl p-6">
        <h2 className="text-text font-semibold mb-6">Applications Trend</h2>
        <TrendChart data={trend} />
      </div>
    </div>
  );
}