// pages/admin/CompanyManagement.jsx
import { useEffect, useState } from "react";
import { getAllCompanies, updateCompany, deleteCompany } from "../../api/companyApi";

const CATEGORIES = [
  "ai", "automotive", "tech", "consulting", "retail",
  "education", "finance", "gaming", "healthcare", "startup", "telecom",
];
const LOCATION_TYPES = ["remote", "onsite", "hybrid"];

export default function CompanyManagement() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [actionId, setActionId] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      const res = await getAllCompanies();
      setCompanies(Array.isArray(res) ? res : []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load companies");
    } finally {
      setLoading(false);
    }
  }

  function startEdit(company) {
    setEditingId(company._id);
    setEditForm({
      name: company.name ?? "",
      website: company.website ?? "",
      category: company.category ?? "tech",
      location_type: company.location_type ?? "onsite",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm({});
  }

  function handleEditChange(e) {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSave(id) {
    try {
      setActionId(id);
      const res = await updateCompany(id, editForm);
      if (res.success) {
        setCompanies((prev) => prev.map((c) => (c._id === id ? res.company : c)));
        setEditingId(null);
      } else {
        setError(res.message || "Failed to update company");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update company");
    } finally {
      setActionId(null);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this company? Applications referencing it may be affected.")) return;
    try {
      setActionId(id);
      const res = await deleteCompany(id);
      if (res.success) {
        setCompanies((prev) => prev.filter((c) => c._id !== id));
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete company");
    } finally {
      setActionId(null);
    }
  }

  if (loading) return <p className="text-muted">Loading...</p>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">Companies</h1>
        <p className="text-muted text-sm mt-1">{companies.length} total</p>
      </div>

      {error && <p className="text-coral text-sm mb-4">{error}</p>}

      {companies.length === 0 ? (
        <p className="text-muted text-sm">No companies found.</p>
      ) : (
        <div className="bg-panel border border-border rounded-2xl overflow-hidden">
          {companies.map((c) => (
            <div key={c._id} className="px-5 py-4 border-b border-border last:border-b-0">
              {editingId === c._id ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleEditChange}
                      placeholder="Company name"
                      className="bg-panel-2 border border-border focus:border-gold rounded-lg px-3 py-2 text-text text-sm outline-none transition"
                    />
                    <input
                      type="url"
                      name="website"
                      value={editForm.website}
                      onChange={handleEditChange}
                      placeholder="Website"
                      className="bg-panel-2 border border-border focus:border-gold rounded-lg px-3 py-2 text-text text-sm outline-none transition"
                    />
                    <select
                      name="category"
                      value={editForm.category}
                      onChange={handleEditChange}
                      className="bg-panel-2 border border-border rounded-lg px-3 py-2 text-text text-sm outline-none transition"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <select
                      name="location_type"
                      value={editForm.location_type}
                      onChange={handleEditChange}
                      className="bg-panel-2 border border-border rounded-lg px-3 py-2 text-text text-sm outline-none transition"
                    >
                      {LOCATION_TYPES.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSave(c._id)}
                      disabled={actionId === c._id}
                      className="bg-gold hover:opacity-90 disabled:opacity-60 text-gold-ink font-semibold text-xs px-4 py-2 rounded-lg transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="text-muted hover:text-text text-xs px-4 py-2 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text text-sm font-semibold">{c.name}</p>
                    <p className="text-muted text-xs mt-0.5">
                      {c.category} · {c.location_type}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => startEdit(c)}
                      className="text-slate text-xs hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c._id)}
                      disabled={actionId === c._id}
                      className="text-coral text-xs hover:underline disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}