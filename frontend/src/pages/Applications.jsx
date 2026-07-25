// pages/Applications.jsx
import { useEffect, useState } from "react";
import { getApplications } from "../api/applicationApi";
import ApplicationCard from "../components/application/ApplicationCard";
import ApplicationForm from "../components/application/ApplicationForm";

const COLUMNS = [
  "Saved",
  "Applied",
  "OA Scheduled",
  "OA Cleared",
  "Interview Round 1",
  "Interview Round 2",
  "HR Round",
  "Selected",
  "Rejected",
];

const COLUMN_TEXT_COLOR = {
  Saved: "text-muted",
  Applied: "text-slate",
  "OA Scheduled": "text-teal",
  "OA Cleared": "text-teal",
  "Interview Round 1": "text-teal",
  "Interview Round 2": "text-teal",
  "HR Round": "text-teal",
  Selected: "text-gold",
  Rejected: "text-coral",
};

// Shorter labels so narrow columns don't wrap awkwardly
const COLUMN_SHORT_LABEL = {
  Saved: "Saved",
  Applied: "Applied",
  "OA Scheduled": "OA Sched.",
  "OA Cleared": "OA Cleared",
  "Interview Round 1": "Interview 1",
  "Interview Round 2": "Interview 2",
  "HR Round": "HR Round",
  Selected: "Selected",
  Rejected: "Rejected",
};

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm]=useState(false);

  function handleApplicationCreated(newApp){
    setApplications((prev)=>[newApp, ...prev])
  }
  useEffect(() => {
    async function load() {
      try {
        const res = await getApplications();
        if (res.success) {
          setApplications(res.applications ?? []);
        } else {
          setError(res.message || "Failed to load applications");
        }
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load applications");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = applications.filter((app) => {
    const q = search.toLowerCase();
    const companyName = app.company_id?.name ?? app.requested_company?.name ?? "";
    return companyName.toLowerCase().includes(q) || app.role?.toLowerCase().includes(q);
  });

  const grouped = COLUMNS.reduce((acc, status) => {
    acc[status] = filtered.filter((app) => app.status === status);
    return acc;
  }, {});

  if (loading) return <p className="text-muted">Loading...</p>;
  if (error) return <p className="text-coral">{error}</p>;

  return (
    <div className="min-w-0">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text">Applications</h1>
          <p className="text-muted text-sm mt-1">
            {applications.length} total · across {COLUMNS.length} stages
          </p>
        </div>
        <button onClick={()=> setShowForm(true)} className="bg-gold hover:opacity-90 text-gold-ink font-semibold text-sm px-4 py-2.5 rounded-lg transition">
          + Add Application
        </button>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Search company or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-panel border border-border rounded-lg px-4 py-2.5 text-text placeholder-muted outline-none focus:border-gold transition"
        />
      </div>

      {/* Fixed 9-column grid — no horizontal scroll, everything fits screen width */}
      <div className="grid grid-cols-9 gap-2">
        {COLUMNS.map((status) => (
          <div key={status} className="min-w-0">
            <div className="flex flex-col items-start justify-between mb-2 gap-0.5">
              <h2 className={`text-[10px] font-bold tracking-wide uppercase ${COLUMN_TEXT_COLOR[status]}`}>
                {COLUMN_SHORT_LABEL[status]}
              </h2>
              <span className="text-muted text-[10px]">{grouped[status].length}</span>
            </div>

            <div className="space-y-2">
              {grouped[status].map((app) => (
                <ApplicationCard key={app._id} application={app} compact />
              ))}
            </div>
          </div>
        ))}
      </div>

       {showForm && (          
        <ApplicationForm
          onClose={() => setShowForm(false)}
          onCreated={handleApplicationCreated}
        />
      )}
    </div>
  );
}