import { useMemo } from "react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function InterviewCalendar({ interviews }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const { calendarDays, interviewsByDate } = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);

    const byDate = {};
    interviews.forEach((interview) => {
      const date = new Date(interview.interview_date);
      if (date.getFullYear() === year && date.getMonth() === month) {
        const day = date.getDate();
        if (!byDate[day]) byDate[day] = [];
        byDate[day].push(interview);
      }
    });

    return { calendarDays: days, interviewsByDate: byDate };
  }, [interviews, year, month]);

  const monthName = today.toLocaleString("default", { month: "long", year: "numeric" });
  const todayDate = today.getDate();

  return (
    <div>
      <p className="text-text font-semibold mb-4">{monthName}</p>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map((day) => (
          <div key={day} className="text-muted text-xs text-center font-semibold py-1">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, i) => {
          const dayInterviews = day ? interviewsByDate[day] : null;
          const isToday = day === todayDate;

          return (
            <div
              key={i}
              className={`min-h-[60px] rounded-lg border p-1.5 ${
                day
                  ? isToday
                    ? "border-gold bg-gold/5"
                    : "border-border bg-panel-2"
                  : "border-transparent"
              }`}
            >
              {day && (
                <>
                  <p className={`text-xs ${isToday ? "text-gold font-bold" : "text-muted"}`}>
                    {day}
                  </p>
                  {dayInterviews?.slice(0, 2).map((interview) => (
                    <div key={interview._id} className="flex items-center gap-1 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal flex-shrink-0" />
                      <span className="text-[10px] text-text truncate">
                        {interview.application_id?.company_id?.name ?? "Interview"}
                      </span>
                    </div>
                  ))}
                  {dayInterviews?.length > 2 && (
                    <p className="text-[10px] text-muted mt-0.5">+{dayInterviews.length - 2} more</p>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}