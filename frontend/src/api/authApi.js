import axiosInstance from "./axiosInstance";

export const register = async (userData) => {
  const { data } = await axiosInstance.post("/auth/register", userData);
  return data;
};

export const login = async (credentials) => {
  const { data } = await axiosInstance.post("/auth/login", credentials);
  return data;
};

export const logout = async () => {
  const { data } = await axiosInstance.post("/auth/logout");
  return data;
};