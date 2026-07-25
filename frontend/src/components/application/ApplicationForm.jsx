// components/application/ApplicationForm.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createApplication } from "../../api/applicationApi";
import { getResumes } from "../../api/resumeApi";
import { searchCompanies } from "../../api/companyApi";
import { useDebounce } from "../../hooks/useDebounce";

const CATEGORIES = ["startup", "mnc", "product", "service", "unicorn"];
const LOCATION_TYPES = ["onsite", "remote", "hybrid"];

export default function ApplicationForm({ onClose, onCreated }) {
  const navigate = useNavigate();

  const [companyQuery, setCompanyQuery] = useState("");
  const debouncedQuery = useDebounce(companyQuery, 350);
  const [companyResults, setCompanyResults] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null); // { _id, name } or null
  const [showNewCompanyFields, setShowNewCompanyFields] = useState(false);

  const [resumes, setResumes] = useState([]);
  const [loadingResumes, setLoadingResumes] = useState(true);

  const [form, setForm] = useState({
    role: "",
    job_link: "",
    location: "",
    salary: "",
    resume_id: "",
    category: "startup",
    location_type: "onsite",
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

  useEffect(() => {
    if (!debouncedQuery || selectedCompany) {
      setCompanyResults([]);
      return;
    }
    async function search() {
      try {
        const results = await searchCompanies(debouncedQuery);
        console.log("Search results:", results);
        setCompanyResults(Array.isArray(results) ? results : []);
      } catch {
        setCompanyResults([]);
      }
    }
    search();
  }, [debouncedQuery, selectedCompany]);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSelectCompany(company) {
    setSelectedCompany(company);
    setCompanyQuery(company.name);
    setCompanyResults([]);
    setShowNewCompanyFields(false);
  }

  function handleUseNewCompany() {
    setSelectedCompany(null);
    setShowNewCompanyFields(true);
    setCompanyResults([]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!companyQuery.trim()) {
      setError("Please enter or select a company.");
      return;
    }
    if (!form.resume_id) {
      setError("Please select a resume.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        role: form.role,
        job_link: form.job_link,
        location: form.location,
        salary: form.salary ? Number(form.salary) : undefined,
        resume_id: form.resume_id,
        ...(selectedCompany
          ? { companyId: selectedCompany._id }
          : {
              companyName: companyQuery,
              category: form.category,
              location_type: form.location_type,
            }),
      };

      const res = await createApplication(payload);
      if (res.success) {
        onCreated?.(res.application);
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
      <div className="bg-panel border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-text text-lg font-bold">Add Application</h2>
          <button onClick={onClose} className="text-muted hover:text-text transition">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Company search */}
          <div className="relative">
            <label className="block text-sm text-muted mb-1.5">Company</label>
            <input
              type="text"
              value={companyQuery}
              onChange={(e) => {
                setCompanyQuery(e.target.value);
                setSelectedCompany(null);
                setShowNewCompanyFields(false);
              }}
              placeholder="Search or type a new company name"
              required
              className="w-full bg-panel-2 border border-border focus:border-gold rounded-lg px-4 py-2.5 text-text placeholder-muted outline-none focus:ring-2 focus:ring-gold/30 transition"
            />

            {companyResults.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-panel-2 border border-border rounded-lg overflow-hidden shadow-lg">
                {companyResults.map((c) => (
                  <button
                    type="button"
                    key={c._id}
                    onClick={() => handleSelectCompany(c)}
                    className="w-full text-left px-4 py-2.5 text-text text-sm hover:bg-panel transition"
                  >
                    {c.name}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleUseNewCompany}
                  className="w-full text-left px-4 py-2.5 text-gold text-sm hover:bg-panel transition border-t border-border"
                >
                  + Use "{companyQuery}" as new company
                </button>
              </div>
            )}

            {selectedCompany && (
              <p className="text-teal text-xs mt-1.5">✓ Existing company selected</p>
            )}
            {!selectedCompany && showNewCompanyFields && (
              <p className="text-gold text-xs mt-1.5">
                New company — pending admin approval after submission
              </p>
            )}
          </div>

          {/* New company extra fields — only shown if not an existing company */}
          {!selectedCompany && companyQuery && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-muted mb-1.5">Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full bg-panel-2 border border-border rounded-lg px-3 py-2.5 text-text text-sm outline-none focus:border-gold transition"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-muted mb-1.5">Location type</label>
                <select
                  name="location_type"
                  value={form.location_type}
                  onChange={handleChange}
                  className="w-full bg-panel-2 border border-border rounded-lg px-3 py-2.5 text-text text-sm outline-none focus:border-gold transition"
                >
                  {LOCATION_TYPES.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Role */}
          <div>
            <label className="block text-sm text-muted mb-1.5">Role</label>
            <input
              type="text"
              name="role"
              value={form.role}
              onChange={handleChange}
              placeholder="e.g. SDE Intern"
              required
              className="w-full bg-panel-2 border border-border focus:border-gold rounded-lg px-4 py-2.5 text-text placeholder-muted outline-none focus:ring-2 focus:ring-gold/30 transition"
            />
          </div>

          {/* Job link */}
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

          {/* Location + Salary */}
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

          {/* Resume select */}
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
            {submitting ? "Adding..." : "Add Application"}
          </button>
        </form>
      </div>
    </div>
  );
}