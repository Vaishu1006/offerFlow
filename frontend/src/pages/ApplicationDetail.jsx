import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
} from "../api/applicationApi";
import Badge from "../components/common/Badge";
import StatusTimeline from "../components/application/StatusTimeline";
import { formatDate } from "../utils/formatDate";
import MatchScoreCard from "../components/ai/MatchScoreCard";
export default function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    load();
  }, [id]);

  async function load() {
    try {
      setLoading(true);
      const res = await getApplicationById(id);
      if (res.success) {
        setApplication(res.application);
      } else {
        setError(res.message || "Failed to load application");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load application");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(newStatus) {
    try {
      setActionLoading(true);
      const res = await updateApplicationStatus(id, newStatus);
      if (res.success) {
        setApplication(res.application);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update status");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete this application? This cannot be undone.")) return;
    try {
      setActionLoading(true);
      const res = await deleteApplication(id);
      if (res.success) {
        navigate("/applications");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete application");
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) return <p className="text-muted">Loading...</p>;
  if (error) return <p className="text-coral">{error}</p>;
  if (!application) return null;

  const {
    role,
    company_id,
    requested_company,
    status,
    job_link,
    location,
    salary,
    date_applied,
    resume_id,
    approval_status,
  } = application;

  const companyName = company_id?.name ?? requested_company?.name ?? "Pending approval";
  const canFinalize = status !== "Selected" && status !== "Rejected";

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <button
            onClick={() => navigate("/applications")}
            className="text-muted text-sm hover:text-text mb-3 transition"
          >
            ← Back to Applications
          </button>
          <h1 className="text-2xl font-bold text-text">{role}</h1>
          <p className="text-muted text-sm mt-1">{companyName}</p>
        </div>
        <Badge status={status} />
      </div>

      {approval_status === "Pending" && (
        <div className="mb-6 text-sm text-gold bg-gold/10 border border-gold/30 rounded-lg px-4 py-3">
          This company is awaiting admin approval. It won't show up in company listings until approved.
        </div>
      )}

      {/* Status timeline */}
      <div className="bg-panel border border-border rounded-2xl p-6 mb-6">
        <h2 className="text-text font-semibold mb-4">Progress</h2>
        <StatusTimeline status={status} />
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-5 mb-6">
        <div className="bg-panel border border-border rounded-2xl p-6">
          <h2 className="text-text font-semibold mb-4">Details</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Location</dt>
              <dd className="text-text">{location}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Salary</dt>
              <dd className="text-text">
                {salary ? `₹${salary.toLocaleString("en-IN")}` : "—"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Date Applied</dt>
              <dd className="text-text">{formatDate(date_applied)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Resume Used</dt>
              <dd className="text-text">{resume_id?.resume_name ?? "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Job Link</dt>
              <dd>
                <a
                  href={job_link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gold hover:underline"
                >
                  View posting →
                </a>
              </dd>
            </div>
          </dl>
        </div>

        {/* Manual final status actions */}
        {canFinalize && (
          <div className="bg-panel border border-border rounded-2xl p-6">
            <h2 className="text-text font-semibold mb-4">Mark Final Outcome</h2>
            <p className="text-muted text-sm mb-4">
              Once an offer or rejection is confirmed, update it here.
            </p>
            <div className="flex gap-3">
              <button
                disabled={actionLoading}
                onClick={() => handleStatusChange("Selected")}
                className="flex-1 bg-gold hover:opacity-90 disabled:opacity-60 text-gold-ink font-semibold text-sm py-2.5 rounded-lg transition"
              >
                Selected
              </button>
              <button
                disabled={actionLoading}
                onClick={() => handleStatusChange("Rejected")}
                className="flex-1 bg-coral/10 border border-coral/40 hover:bg-coral/20 disabled:opacity-60 text-coral font-semibold text-sm py-2.5 rounded-lg transition"
              >
                Rejected
              </button>
            </div>
          </div>
        )}
      </div>
      {/* AI Match Score — naya section */}
      <div className="mb-6">
        <MatchScoreCard applicationId={application._id} />
      </div>
      
      {/* Danger zone */}
      <div className="flex justify-end">
        <button
          disabled={actionLoading}
          onClick={handleDelete}
          className="text-coral text-sm hover:underline disabled:opacity-60"
        >
          Delete Application
        </button>
      </div>
    </div>
  );
}