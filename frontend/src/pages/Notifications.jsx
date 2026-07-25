// pages/Notifications.jsx
import { useEffect, useState } from "react";
import { getNotifications, markNotificationAsRead } from "../api/notificationApi";
import { timeAgo } from "../utils/formatDate";

const TYPE_DOT_COLOR = {
  interview_scheduled: "bg-gold",
  interview_updated: "bg-gold",
  interview_cancelled: "bg-coral",
  interview_reminder: "bg-gold",
  application_status_changed: "bg-teal",
  follow_up_reminder: "bg-slate",
  oa_deadline_today: "bg-coral",
  general: "bg-slate",
};

function NotificationRow({ notification, onMarkAsRead }) {
  const { _id, title, message, isRead, type, createdAt } = notification;

  return (
    <div
      onClick={() => !isRead && onMarkAsRead(_id)}
      className={`flex items-start gap-3 px-5 py-4 border-b border-border last:border-b-0 transition ${
        !isRead ? "cursor-pointer hover:bg-panel-2" : ""
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
          isRead ? "bg-transparent" : TYPE_DOT_COLOR[type] ?? "bg-slate"
        }`}
      />
      <div>
        <p className={`text-sm ${isRead ? "text-muted" : "text-text font-semibold"}`}>{title}</p>
        {message && <p className="text-muted text-xs mt-0.5">{message}</p>}
        <p className="text-muted text-xs mt-1">{timeAgo(createdAt)}</p>
      </div>
    </div>
  );
}

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      const res = await getNotifications();
      if (res.success) {
        setNotifications(res.notifications ?? []);
      } else {
        setError(res.message || "Failed to load notifications");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkAsRead(id) {
    try {
      const res = await markNotificationAsRead(id);
      if (res.success) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update notification");
    }
  }

  async function handleMarkAllAsRead() {
    const unread = notifications.filter((n) => !n.isRead);
    if (unread.length === 0) return;

    try {
      setMarkingAll(true);
      await Promise.all(unread.map((n) => markNotificationAsRead(n._id)));
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to mark all as read");
    } finally {
      setMarkingAll(false);
    }
  }

  if (loading) return <p className="text-muted">Loading...</p>;
  if (error) return <p className="text-coral">{error}</p>;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const isToday = (date) => {
    const d = new Date(date);
    const now = new Date();
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  };

  const today = notifications.filter((n) => isToday(n.createdAt));
  const earlier = notifications.filter((n) => !isToday(n.createdAt));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text">Notifications</h1>
          <p className="text-muted text-sm mt-1">{unreadCount} unread</p>
        </div>
        <button
          onClick={handleMarkAllAsRead}
          disabled={markingAll || unreadCount === 0}
          className="border border-border hover:border-gold/40 text-text disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm px-4 py-2.5 rounded-lg transition"
        >
          Mark all as read
        </button>
      </div>

      {today.length > 0 && (
        <div className="mb-8">
          <h2 className="text-muted text-xs font-bold tracking-wide uppercase mb-3">Today</h2>
          <div className="bg-panel border border-border rounded-2xl overflow-hidden">
            {today.map((n) => (
              <NotificationRow key={n._id} notification={n} onMarkAsRead={handleMarkAsRead} />
            ))}
          </div>
        </div>
      )}

      {earlier.length > 0 && (
        <div>
          <h2 className="text-muted text-xs font-bold tracking-wide uppercase mb-3">Earlier</h2>
          <div className="bg-panel border border-border rounded-2xl overflow-hidden">
            {earlier.map((n) => (
              <NotificationRow key={n._id} notification={n} onMarkAsRead={handleMarkAsRead} />
            ))}
          </div>
        </div>
      )}

      {notifications.length === 0 && (
        <p className="text-muted text-sm">You're all caught up — no notifications yet.</p>
      )}
    </div>
  );
}