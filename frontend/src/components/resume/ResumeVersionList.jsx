// components/resume/ResumeVersionList.jsx
import { timeAgo } from "../../utils/formatDate";

export default function ResumeVersionList({ resumes, latestByCategory, onDelete, deletingId }) {
  return (
    <div className="bg-panel border border-border rounded-2xl overflow-hidden mt-6">
      {resumes.map((resume) => {
        const isLatest = latestByCategory[resume.category] === resume._id;
        return (
          <div
            key={resume._id}
            className="flex items-center justify-between px-5 py-4 border-b border-border last:border-b-0 hover:bg-panel-2 transition"
          >
            <a
              href={resume.file_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 flex-1 min-w-0"
            >
              <div className="w-9 h-9 rounded-lg bg-panel-2 border border-border flex items-center justify-center text-muted text-[10px] font-bold flex-shrink-0">
                PDF
              </div>
              <div className="min-w-0">
                <p className="text-text text-sm font-semibold truncate">{resume.resume_name}</p>
                <p className="text-muted text-xs mt-0.5">
                  Uploaded {timeAgo(resume.createdAt)} · v{resume.version} · {resume.category}
                </p>
              </div>
            </a>

            <div className="flex items-center gap-3 flex-shrink-0">
              {isLatest && (
                <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-1 rounded-full border text-gold border-gold/40 bg-gold/10">
                  Latest
                </span>
              )}
              <button
                disabled={deletingId === resume._id}
                onClick={() => onDelete(resume._id)}
                className="text-muted hover:text-coral text-xs transition disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}