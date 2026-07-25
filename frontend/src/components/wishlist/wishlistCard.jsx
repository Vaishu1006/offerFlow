// components/wishlist/wishlistCard.jsx
const STATUS_COLOR_MAP = {
  slate: "text-slate",
  teal: "text-teal",
  gold: "text-gold",
  coral: "text-coral",
};

export default function WishlistCard({ item, onMoveToApplications, onRemove, loading }) {
  const { _id, company_id, role, status, status_color } = item;
  const companyName = company_id?.name ?? "Unknown Company";

  return (
    <div className="bg-panel border border-border rounded-2xl p-6 transition-transform duration-150 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/30">
      <div className="flex items-start justify-between mb-4">
        <div className="w-9 h-9 rounded-lg bg-panel-2 border border-border flex items-center justify-center text-text text-sm font-semibold">
          {companyName.charAt(0).toUpperCase()}
        </div>
        <button
          onClick={() => onRemove(_id)}
          disabled={loading}
          className="text-muted hover:text-coral text-xs transition disabled:opacity-50"
        >
          Remove
        </button>
      </div>

      <h3 className="text-text font-semibold">{companyName}</h3>
      <p className={`text-sm mt-0.5 ${STATUS_COLOR_MAP[status_color] ?? "text-muted"}`}>{role}</p>

      <button
        onClick={() => onMoveToApplications(item)}
        disabled={loading}
        className="w-full mt-5 bg-gold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-gold-ink font-semibold text-sm py-2.5 rounded-lg transition"
      >
        Move to Applications
      </button>
    </div>
  );
}