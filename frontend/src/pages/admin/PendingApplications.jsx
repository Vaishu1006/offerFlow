// pages/admin/PendingApplications.jsx
import { useEffect, useState } from "react";
import { getPendingApplications, approveApplication } from "../../api/applicationApi";
import { timeAgo } from "../../utils/formatDate";

export default function PendingApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      const res = await getPendingApplications();
      if (res.success) {
        setApplications(res.applications ?? []);
      } else {
        setError(res.message || "Failed to load pending applications");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load pending applications");
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(id) {
    try {
      setActionId(id);
      const res = await approveApplication(id);
      if (res.success) {
        setApplications((prev) => prev.filter((app) => app._id !== id));
      } else {
        setError(res.message || "Failed to approve application");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to approve application");
    } finally {
      setActionId(null);
    }
  }

  if (loading) return <p className="text-muted">Loading...</p>;
  if (error) return <p className="text-coral">{error}</p>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text">Pending Approvals</h1>
        <p className="text-muted text-sm mt-1">
          New companies awaiting approval — {applications.length} pending
        </p>
      </div>

      {applications.length === 0 ? (
        <p className="text-muted text-sm">No pending approvals right now.</p>
      ) : (
        <div className="bg-panel border border-border rounded-2xl overflow-hidden">
          {applications.map((app) => (
            <div
              key={app._id}
              className="flex items-center justify-between px-5 py-4 border-b border-border last:border-b-0"
            >
              <div>
                <p className="text-text text-sm font-semibold">
                  {app.requested_company?.name} — {app.role}
                </p>
                <p className="text-muted text-xs mt-1">
                  Requested by {app.user_id?.fullName} ({app.user_id?.email})
                </p>
                <p className="text-muted text-xs mt-0.5">
                  Category: {app.requested_company?.category} · Location type:{" "}
                  {app.requested_company?.location_type} · {timeAgo(app.createdAt)}
                </p>
              </div>

              <button
                onClick={() => handleApprove(app._id)}
                disabled={actionId === app._id}
                className="bg-gold hover:opacity-90 disabled:opacity-60 text-gold-ink font-semibold text-sm px-4 py-2 rounded-lg transition flex-shrink-0"
              >
                {actionId === app._id ? "Approving..." : "Approve"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}