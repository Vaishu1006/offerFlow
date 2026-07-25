// components/application/ApplicationCard.jsx
import { Link } from "react-router-dom";
import Badge from "../common/Badge";
import { timeAgo } from "../../utils/formatDate";

const BORDER_STYLES = {
  Saved: "border-l-border",
  Applied: "border-l-slate",
  "OA Scheduled": "border-l-teal",
  "OA Cleared": "border-l-teal",
  "Interview Round 1": "border-l-teal",
  "Interview Round 2": "border-l-teal",
  "HR Round": "border-l-teal",
  Selected: "border-l-gold",
  Rejected: "border-l-coral",
};

export default function ApplicationCard({ application, compact = false }) {
  const { _id, role, company_id, requested_company, status, date_applied } = application;
  const companyName = company_id?.name ?? requested_company?.name ?? "Pending approval";

  return (
    <Link
      to={`/applications/${_id}`}
      className={`block bg-panel border border-border border-l-[3px] ${
        BORDER_STYLES[status] ?? "border-l-border"
      } rounded-lg transition-transform duration-150 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/30 ${
        compact ? "p-2.5" : "p-4 mb-3"
      }`}
    >
      <h3 className={`text-text font-semibold truncate ${compact ? "text-xs" : "text-sm"}`}>
        {role}
      </h3>
      <p className={`text-muted truncate ${compact ? "text-[11px] mt-0.5" : "text-sm mt-0.5"}`}>
        {companyName}
      </p>

      {!compact && (
        <div className="flex items-center justify-between mt-4 gap-2">
          <span className="text-muted text-xs font-mono">{timeAgo(date_applied)}</span>
          <Badge status={status} />
        </div>
      )}
      {compact && (
        <span className="text-muted text-[10px] font-mono block mt-1.5">
          {timeAgo(date_applied)}
        </span>
      )}
    </Link>
  );
}