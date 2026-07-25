// components/interview/ScheduleForm.jsx
import { useEffect, useState } from "react";
import { getApplications } from "../../api/applicationApi";
import { scheduleInterview } from "../../api/interviewApi";

const ROUND_TYPES = [
  "OA",
  "Interview Round 1",
  "Interview Round 2",
  "System Design",
  "Managerial",
  "HR Round",
  "Other",
];

export default function ScheduleForm({ onClose, onScheduled }) {
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);

  const [form, setForm] = useState({
    application_id: "",
    interview_date: "",
    interview_time: "",
    round_type: "Interview Round 1",
    custom_round_name: "",
    meeting_url: "",
    interview_notes: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await getApplications();
        if (res.success) {
          // Only applications not yet finalized can have interviews scheduled
          const eligible = (res.applications ?? []).filter(
            (app) => app.status !== "Selected" && app.status !== "Rejected"
          );
          setApplications(eligible);
        }
      } finally {
        setLoadingApps(false);
      }
    }
    load();
  }, []);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.application_id) {
      setError("Please select an application.");
      return;
    }
    if (!form.interview_date || !form.interview_time) {
      setError("Please select both date and time.");
      return;
    }
    if (form.round_type === "Other" && !form.custom_round_name.trim()) {
      setError("Please enter a custom round name.");
      return;
    }

    setSubmitting(true);
    try {
      const interview_date = new Date(
        `${form.interview_date}T${form.interview_time}`
      ).toISOString();

      const payload = {
        application_id: form.application_id,
        interview_date,
        round_type: form.round_type,
        ...(form.round_type === "Other" && {
          custom_round_name: form.custom_round_name,
        }),
        ...(form.meeting_url && { meeting_url: form.meeting_url }),
        ...(form.interview_notes && { interview_notes: form.interview_notes }),
      };

      const res = await scheduleInterview(payload);
      if (res.success) {
        onScheduled?.(res.interview);
        onClose();
      } else {
        setError(res.message || "Failed to schedule interview");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to schedule interview");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-panel border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-text text-lg font-bold">Schedule Interview</h2>
          <button onClick={onClose} className="text-muted hover:text-text transition">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Application select */}
          <div>
            <label className="block text-sm text-muted mb-1.5">Application</label>
            <select
              name="application_id"
              value={form.application_id}
              onChange={handleChange}
              required
              disabled={loadingApps}
              className="w-full bg-panel-2 border border-border rounded-lg px-4 py-2.5 text-text text-sm outline-none focus:border-gold transition"
            >
              <option value="">
                {loadingApps ? "Loading applications..." : "Select an application"}
              </option>
              {applications.map((app) => {
                const companyName =
                  app.company_id?.name ?? app.requested_company?.name ?? "Unknown";
                return (
                  <option key={app._id} value={app._id}>
                    {companyName} — {app.role}
                  </option>
                );
              })}
            </select>
            {!loadingApps && applications.length === 0 && (
              <p className="text-coral text-xs mt-1.5">
                No eligible applications — add one first, or all are already Selected/Rejected.
              </p>
            )}
          </div>

          {/* Round type */}
          <div>
            <label className="block text-sm text-muted mb-1.5">Round type</label>
            <select
              name="round_type"
              value={form.round_type}
              onChange={handleChange}
              className="w-full bg-panel-2 border border-border rounded-lg px-4 py-2.5 text-text text-sm outline-none focus:border-gold transition"
            >
              {ROUND_TYPES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Custom round name — only if "Other" */}
          {form.round_type === "Other" && (
            <div>
              <label className="block text-sm text-muted mb-1.5">Custom round name</label>
              <input
                type="text"
                name="custom_round_name"
                value={form.custom_round_name}
                onChange={handleChange}
                placeholder="e.g. Culture Fit Round"
                required
                className="w-full bg-panel-2 border border-border focus:border-gold rounded-lg px-4 py-2.5 text-text placeholder-muted outline-none focus:ring-2 focus:ring-gold/30 transition"
              />
            </div>
          )}

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-muted mb-1.5">Date</label>
              <input
                type="date"
                name="interview_date"
                value={form.interview_date}
                onChange={handleChange}
                required
                className="w-full bg-panel-2 border border-border focus:border-gold rounded-lg px-4 py-2.5 text-text outline-none focus:ring-2 focus:ring-gold/30 transition"
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1.5">Time</label>
              <input
                type="time"
                name="interview_time"
                value={form.interview_time}
                onChange={handleChange}
                required
                className="w-full bg-panel-2 border border-border focus:border-gold rounded-lg px-4 py-2.5 text-text outline-none focus:ring-2 focus:ring-gold/30 transition"
              />
            </div>
          </div>

          {/* Meeting URL */}
          <div>
            <label className="block text-sm text-muted mb-1.5">Meeting link (optional)</label>
            <input
              type="url"
              name="meeting_url"
              value={form.meeting_url}
              onChange={handleChange}
              placeholder="https://meet.google.com/..."
              className="w-full bg-panel-2 border border-border focus:border-gold rounded-lg px-4 py-2.5 text-text placeholder-muted outline-none focus:ring-2 focus:ring-gold/30 transition"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm text-muted mb-1.5">Notes (optional)</label>
            <textarea
              name="interview_notes"
              value={form.interview_notes}
              onChange={handleChange}
              rows={3}
              placeholder="Any prep notes or context..."
              className="w-full bg-panel-2 border border-border focus:border-gold rounded-lg px-4 py-2.5 text-text placeholder-muted outline-none focus:ring-2 focus:ring-gold/30 transition resize-none"
            />
          </div>

          {error && <p className="text-coral text-xs">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gold hover:opacity-90 disabled:opacity-60 text-gold-ink font-semibold text-sm py-2.5 rounded-lg transition"
          >
            {submitting ? "Scheduling..." : "Schedule Interview"}
          </button>
        </form>
      </div>
    </div>
  );
}