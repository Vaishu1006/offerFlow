// hooks/useNotifications.js
import { useState, useEffect, useCallback } from "react";
import { getNotifications, markNotificationAsRead } from "../api/notificationApi";

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await getNotifications();
      if (res.success) {
        setNotifications(res.notifications ?? []);
      }
    } catch {
      // silent fail — dropdown just stays empty, main page handles real errors
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    // Poll every 60s so the badge count stays reasonably fresh without sockets
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, [load]);

  async function markOneAsRead(id) {
    try {
      const res = await markNotificationAsRead(id);
      if (res.success) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );
      }
    } catch {
      // ignore — user can retry from full page
    }
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const recent = notifications.slice(0, 5);

  return { notifications, recent, unreadCount, loading, markNotificationAsRead, reload: load };
}