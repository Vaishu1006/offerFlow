import axiosInstance from "./axiosInstance";

// Schedule a new interview
export const scheduleInterview = async (interviewData) => {
  const { data } = await axiosInstance.post("/interviews", interviewData);
  return data;
};

// Get all interviews
export const getInterviews = async () => {
  const { data } = await axiosInstance.get("/interviews");
  return data;
};

// Get interview by ID
export const getInterviewById = async (id) => {
  const { data } = await axiosInstance.get(`/interviews/${id}`);
  return data;
};

// Update interview
export const updateInterview = async (id, interviewData) => {
  const { data } = await axiosInstance.put(
    `/interviews/${id}`,
    interviewData
  );
  return data;
};

// Delete interview
export const deleteInterview = async (id) => {
  const { data } = await axiosInstance.delete(`/interviews/${id}`);
  return data;
};