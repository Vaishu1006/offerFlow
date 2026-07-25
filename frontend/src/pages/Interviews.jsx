// pages/Interviews.jsx
import { useEffect, useState } from "react";
import { getInterviews } from "../api/interviewApi";
import InterviewCard from "../components/interview/InterviewCard";
import ScheduleForm from "../components/interview/ScheduleForm";

export default function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await getInterviews({ status: "scheduled" });
        if (res.success) {
          setInterviews(res.interviews ?? []);
        } else {
          setError(res.message || "Failed to load interviews");
        }
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load interviews");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function handleScheduled(newInterview) {
    setInterviews((prev) => [...prev, newInterview]);
  }

  if (loading) return <p className="text-muted">Loading...</p>;
  if (error) return <p className="text-coral">{error}</p>;

  const now = new Date();
  const weekFromNow = new Date();
  weekFromNow.setDate(now.getDate() + 7);

  const thisWeek = interviews.filter((i) => new Date(i.interview_date) <= weekFromNow);
  const later = interviews.filter((i) => new Date(i.interview_date) > weekFromNow);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text">Interviews</h1>
          <p className="text-muted text-sm mt-1">{interviews.length} upcoming</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gold hover:opacity-90 text-gold-ink font-semibold text-sm px-4 py-2.5 rounded-lg transition"
        >
          + Schedule
        </button>
      </div>

      {thisWeek.length > 0 && (
        <div className="mb-8">
          <h2 className="text-muted text-xs font-bold tracking-wide uppercase mb-3">This Week</h2>
          <div className="bg-panel border border-border rounded-2xl overflow-hidden">
            {thisWeek.map((interview) => (
              <InterviewCard key={interview._id} interview={interview} />
            ))}
          </div>
        </div>
      )}

      {later.length > 0 && (
        <div>
          <h2 className="text-muted text-xs font-bold tracking-wide uppercase mb-3">Later</h2>
          <div className="bg-panel border border-border rounded-2xl overflow-hidden">
            {later.map((interview) => (
              <InterviewCard key={interview._id} interview={interview} />
            ))}
          </div>
        </div>
      )}

      {interviews.length === 0 && (
        <p className="text-muted text-sm">No upcoming interviews scheduled.</p>
      )}

      {showForm && (
        <ScheduleForm onClose={() => setShowForm(false)} onScheduled={handleScheduled} />
      )}
    </div>
  );
}