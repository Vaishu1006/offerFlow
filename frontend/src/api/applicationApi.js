import axiosInstance from "./axiosInstance";

export const createApplication = async (applicationData) => {
  const { data } = await axiosInstance.post("/applications", applicationData);
  return data;
};

export const getApplications = async () => {
  const { data } = await axiosInstance.get("/applications");
  return data;
};

export const getPendingApplications = async () => {
  const { data } = await axiosInstance.get("/applications/pending");
  return data;
};

export const approveApplication = async (id) => {
  const { data } = await axiosInstance.put(`/applications/${id}/approve`);
  return data;
};

export const getApplicationById = async (id) => {
  const { data } = await axiosInstance.get(`/applications/${id}`);
  return data;
};

export const updateApplicationStatus = async (id, status, rejection_reason) => {
  const { data } = await axiosInstance.put(`/applications/${id}/status`, {
    status,
    ...(rejection_reason && { rejection_reason }),
  });
  return data;
};

export const updateApplication = async (id, updateData) => {
  const { data } = await axiosInstance.put(`/applications/${id}`, updateData);
  return data;
};

export const deleteApplication = async (id) => {
  const { data } = await axiosInstance.delete(`/applications/${id}`);
  return data;
};