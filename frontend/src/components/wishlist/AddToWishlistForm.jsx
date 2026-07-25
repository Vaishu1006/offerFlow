// components/wishlist/AddToWishlistForm.jsx
import { useEffect, useState } from "react";
import { searchCompanies } from "../../api/companyApi";
import { addToWishlist } from "../../api/wishlistApi";
import { useDebounce } from "../../hooks/useDebounce";

export default function AddToWishlistForm({ onClose, onAdded }) {
  const [companyQuery, setCompanyQuery] = useState("");
  const debouncedQuery = useDebounce(companyQuery, 350);
  const [companyResults, setCompanyResults] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const [role, setRole] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!debouncedQuery || selectedCompany) {
      setCompanyResults([]);
      return;
    }
    async function search() {
      try {
        const results = await searchCompanies(debouncedQuery);
        setCompanyResults(Array.isArray(results) ? results : []);
      } catch {
        setCompanyResults([]);
      }
    }
    search();
  }, [debouncedQuery, selectedCompany]);

  function handleSelectCompany(company) {
    setSelectedCompany(company);
    setCompanyQuery(company.name);
    setCompanyResults([]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!selectedCompany) {
      setError("Please select a company from the search results.");
      return;
    }
    if (!role.trim()) {
      setError("Please enter a role.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await addToWishlist({
        company_id: selectedCompany._id,
        role: role.trim(),
      });
      if (res.success) {
        onAdded?.(res.wishlist);
        onClose();
      } else {
        setError(res.message || "Failed to add to wishlist");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add to wishlist");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-panel border border-border rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-text text-lg font-bold">Add Company to Wishlist</h2>
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
              }}
              placeholder="Search for a company..."
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
              </div>
            )}

            {selectedCompany && (
              <p className="text-teal text-xs mt-1.5">✓ {selectedCompany.name} selected</p>
            )}
            {!selectedCompany && companyQuery && companyResults.length === 0 && (
              <p className="text-muted text-xs mt-1.5">
                No matching companies found. Wishlist only supports existing companies — try a different search term.
              </p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm text-muted mb-1.5">Role</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Software Engineer"
              required
              className="w-full bg-panel-2 border border-border focus:border-gold rounded-lg px-4 py-2.5 text-text placeholder-muted outline-none focus:ring-2 focus:ring-gold/30 transition"
            />
          </div>

          {error && <p className="text-coral text-xs">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gold hover:opacity-90 disabled:opacity-60 text-gold-ink font-semibold text-sm py-2.5 rounded-lg transition"
          >
            {submitting ? "Adding..." : "Add to Wishlist"}
          </button>
        </form>
      </div>
    </div>
  );
}