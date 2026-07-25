// components/notification/NotificationDropdown.jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { useNotifications } from "../../hooks/useNotifications";
import { timeAgo } from "../../utils/formatDate";

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  const { recent, unreadCount, markOneAsRead } = useNotifications();

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleItemClick(notification) {
    if (!notification.isRead) markOneAsRead(notification._id);
    setOpen(false);
    navigate("/notifications");
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-muted hover:bg-panel hover:text-text transition"
      >
        <Bell size={18} />
        Notifications
        {unreadCount > 0 && (
          <span className="ml-auto bg-coral text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-full bottom-0 ml-2 w-80 bg-panel border border-border rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-text text-sm font-semibold">Notifications</p>
          </div>

          {recent.length === 0 ? (
            <p className="text-muted text-sm px-4 py-6 text-center">No notifications yet.</p>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {recent.map((n) => (
                <button
                  key={n._id}
                  onClick={() => handleItemClick(n)}
                  className="w-full text-left flex items-start gap-2.5 px-4 py-3 border-b border-border last:border-b-0 hover:bg-panel-2 transition"
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                      n.isRead ? "bg-transparent" : "bg-gold"
                    }`}
                  />
                  <div className="min-w-0">
                    <p className={`text-xs truncate ${n.isRead ? "text-muted" : "text-text font-semibold"}`}>
                      {n.title}
                    </p>
                    <p className="text-muted text-[10px] mt-0.5">{timeAgo(n.createdAt)}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => {
              setOpen(false);
              navigate("/notifications");
            }}
            className="w-full text-center text-gold text-xs font-semibold py-3 hover:bg-panel-2 transition border-t border-border"
          >
            View all
          </button>
        </div>
      )}
    </div>
  );
}