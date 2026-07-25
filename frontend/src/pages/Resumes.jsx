// pages/Resumes.jsx
import { useEffect, useState } from "react";
import { getResumes, deleteResume } from "../api/resumeApi";
import ResumeUpload from "../components/resume/ResumeUpload";
import ResumeVersionList from "../components/resume/ResumeVersionList";

export default function Resumes() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      const res = await getResumes();
      if (res.success) {
        setResumes(res.resumes ?? []);
      } else {
        setError(res.message || "Failed to load resumes");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load resumes");
    } finally {
      setLoading(false);
    }
  }

  function handleUploaded(newResume) {
    setResumes((prev) => [newResume, ...prev]);
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this resume version? This cannot be undone.")) return;
    try {
      setDeletingId(id);
      const res = await deleteResume(id);
      if (res.success) {
        setResumes((prev) => prev.filter((r) => r._id !== id));
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete resume");
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) return <p className="text-muted">Loading...</p>;
  if (error) return <p className="text-coral">{error}</p>;

  // Highest version per category = "Latest" badge
  const latestByCategory = resumes.reduce((acc, r) => {
    if (!acc[r.category] || r.version > acc[`${r.category}_version`]) {
      acc[r.category] = r._id;
      acc[`${r.category}_version`] = r.version;
    }
    return acc;
  }, {});

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">Resumes</h1>
        <p className="text-muted text-sm mt-1">
          {resumes.length} version{resumes.length !== 1 ? "s" : ""}
        </p>
      </div>

      <ResumeUpload onUploaded={handleUploaded} />

      {resumes.length > 0 ? (
        <ResumeVersionList
          resumes={resumes}
          latestByCategory={latestByCategory}
          onDelete={handleDelete}
          deletingId={deletingId}
        />
      ) : (
        <p className="text-muted text-sm mt-6">No resumes uploaded yet.</p>
      )}
    </div>
  );
}