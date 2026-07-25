const STAGES = [
  "Saved",
  "Applied",
  "OA Scheduled",
  "OA Cleared",
  "Interview Round 1",
  "Interview Round 2",
  "HR Round",
  "Selected",
];

export default function StatusTimeline({ status }) {
  if (status === "Rejected") {
    return (
      <div className="flex items-center gap-2 text-coral text-sm font-semibold">
        <span className="w-2.5 h-2.5 rounded-full bg-coral" />
        Rejected
      </div>
    );
  }

  const currentIndex = STAGES.indexOf(status);

  return (
    <div className="flex items-center overflow-x-auto pb-2">
      {STAGES.map((stage, i) => {
        const isDone = i < currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <div key={stage} className="flex items-center flex-shrink-0">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={`w-3 h-3 rounded-full ${
                  isCurrent
                    ? "bg-gold"
                    : isDone
                    ? "bg-teal"
                    : "bg-panel-2 border border-border"
                }`}
              />
              <span
                className={`text-[10px] whitespace-nowrap ${
                  isCurrent ? "text-gold font-semibold" : isDone ? "text-teal" : "text-muted"
                }`}
              >
                {stage}
              </span>
            </div>
            {i < STAGES.length - 1 && (
              <div className={`w-10 h-px mx-1 mb-4 ${isDone ? "bg-teal" : "bg-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}