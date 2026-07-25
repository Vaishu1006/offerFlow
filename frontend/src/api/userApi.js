import axiosInstance from "./axiosInstance";

// ======================
// User APIs
// ======================

// Get Logged-in User Profile
export const getProfile = async () => {
  const { data } = await axiosInstance.get("/users/me");
  return data;
};

// Update Logged-in User Profile
export const updateProfile = async (profileData) => {
  const { data } = await axiosInstance.put("/users/me", profileData);
  return data;
};

// Change Password
export const changePassword = async (passwordData) => {
  const { data } = await axiosInstance.patch(
    "/users/me/changePassword",
    passwordData
  );
  return data;
};

// ======================
// Admin APIs
// ======================

// Get All Users
export const getAllUsers = async (params={}) => {
  const { data } = await axiosInstance.get("/users", {params});
  return data;
};

// Get User By ID
export const getUserById = async (id) => {
  const { data } = await axiosInstance.get(`/users/${id}`);
  return data;
};

// Delete User
export const deleteUser = async (id) => {
  const { data } = await axiosInstance.delete(`/users/${id}`);
  return data;
};

// api/userApi.js mein add karo
export const updateUser = async (id, updates) => {
  const { data } = await axiosInstance.put(`/users/${id}`, updates);
  return data; // { success, user }
};