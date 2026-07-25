// components/wishlist/ConvertToApplicationForm.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createApplication } from "../../api/applicationApi";
import { getResumes } from "../../api/resumeApi";
import { removeFromWishlist } from "../../api/wishlistApi";

export default function ConvertToApplicationForm({ wishlistItem, onClose, onConverted }) {
  const navigate = useNavigate();
  const companyName = wishlistItem.company_id?.name ?? "this company";

  const [resumes, setResumes] = useState([]);
  const [loadingResumes, setLoadingResumes] = useState(true);

  const [form, setForm] = useState({
    job_link: "",
    location: "",
    salary: "",
    resume_id: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadResumes() {
      try {
        const res = await getResumes();
        if (res.success) setResumes(res.resumes ?? []);
      } finally {
        setLoadingResumes(false);
      }
    }
    loadResumes();
  }, []);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.resume_id) {
      setError("Please select a resume.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        companyId: wishlistItem.company_id._id,
        role: wishlistItem.role,
        job_link: form.job_link,
        location: form.location,
        salary: form.salary ? Number(form.salary) : undefined,
        resume_id: form.resume_id,
      };

      const res = await createApplication(payload);
      if (res.success) {
        // Wishlist item ab officially Application ban chuka hai — remove it
        await removeFromWishlist(wishlistItem._id);
        onConverted?.(wishlistItem._id, res.application);
        onClose();
        navigate(`/applications/${res.application._id}`);
      } else {
        setError(res.message || "Failed to create application");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create application");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-panel border border-border rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-text text-lg font-bold">Move to Applications</h2>
          <button onClick={onClose} className="text-muted hover:text-text transition">
            ✕
          </button>
        </div>
        <p className="text-muted text-sm mb-6">
          {companyName} — {wishlistItem.role}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-muted mb-1.5">Job link</label>
            <input
              type="url"
              name="job_link"
              value={form.job_link}
              onChange={handleChange}
              placeholder="https://..."
              required
              className="w-full bg-panel-2 border border-border focus:border-gold rounded-lg px-4 py-2.5 text-text placeholder-muted outline-none focus:ring-2 focus:ring-gold/30 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-muted mb-1.5">Location</label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Bengaluru"
                required
                className="w-full bg-panel-2 border border-border focus:border-gold rounded-lg px-4 py-2.5 text-text placeholder-muted outline-none focus:ring-2 focus:ring-gold/30 transition"
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1.5">Salary (optional)</label>
              <input
                type="number"
                name="salary"
                value={form.salary}
                onChange={handleChange}
                placeholder="600000"
                min="0"
                className="w-full bg-panel-2 border border-border focus:border-gold rounded-lg px-4 py-2.5 text-text placeholder-muted outline-none focus:ring-2 focus:ring-gold/30 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-muted mb-1.5">Resume</label>
            <select
              name="resume_id"
              value={form.resume_id}
              onChange={handleChange}
              required
              disabled={loadingResumes}
              className="w-full bg-panel-2 border border-border rounded-lg px-4 py-2.5 text-text text-sm outline-none focus:border-gold transition"
            >
              <option value="">
                {loadingResumes ? "Loading resumes..." : "Select a resume"}
              </option>
              {resumes.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.resume_name} (v{r.version})
                </option>
              ))}
            </select>
            {!loadingResumes && resumes.length === 0 && (
              <p className="text-coral text-xs mt-1.5">
                No resumes uploaded yet — upload one from the Resumes page first.
              </p>
            )}
          </div>

          {error && <p className="text-coral text-xs">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gold hover:opacity-90 disabled:opacity-60 text-gold-ink font-semibold text-sm py-2.5 rounded-lg transition"
          >
            {submitting ? "Creating..." : "Create Application"}
          </button>
        </form>
      </div>
    </div>
  );
}