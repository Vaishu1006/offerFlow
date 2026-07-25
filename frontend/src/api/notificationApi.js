import axiosInstance from "./axiosInstance";

// Get all notifications
export const getNotifications = async () => {
  const { data } = await axiosInstance.get("/notifications");
  return data;
};

// Mark notification as read
export const markNotificationAsRead = async (id) => {
  const { data } = await axiosInstance.patch(
    `/notifications/${id}/read`
  );
  return data;
};

// Delete notification
export const deleteNotification = async (id) => {
  const { data } = await axiosInstance.delete(
    `/notifications/${id}`
  );
  return data;
};