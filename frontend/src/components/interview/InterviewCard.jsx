// components/interview/InterviewCard.jsx
import { formatInterviewDate } from "../../utils/formatDate";

export default function InterviewCard({ interview }) {
  const { application_id, interview_date, round_type, custom_round_name, meeting_url } = interview;
  const companyName = application_id?.company_id?.name ?? "Unknown Company";
  const role = application_id?.role ?? "—";
  const roundLabel = round_type === "Other" ? custom_round_name : round_type;

  const CardTag = meeting_url ? "a" : "div";
  const linkProps = meeting_url ? { href: meeting_url, target: "_blank", rel: "noreferrer" } : {};

  return (
    <CardTag
      {...linkProps}
      className="flex items-center justify-between px-5 py-4 border-b border-border last:border-b-0 hover:bg-panel-2 transition"
    >
      <div className="flex items-center gap-4">
        <div className="w-9 h-9 rounded-lg bg-panel-2 border border-border flex items-center justify-center text-text text-sm font-semibold flex-shrink-0">
          {companyName.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-text text-sm font-semibold">
            {companyName} — {role}
          </p>
          <p className="text-muted text-xs mt-0.5">{roundLabel}</p>
        </div>
      </div>

      <span className="text-muted text-xs font-mono bg-panel-2 border border-border rounded-full px-3 py-1 whitespace-nowrap">
        {formatInterviewDate(interview_date)}
      </span>
    </CardTag>
  );
}