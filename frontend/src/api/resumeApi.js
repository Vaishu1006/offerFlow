import axiosInstance from "./axiosInstance";

// Upload Resume
export const uploadResume = async (formData) => {
  const { data } = await axiosInstance.post("/resumes", formData, {headers:{"Content-Type": undefined}});
  return data;
};

// Get All Resumes
export const getResumes = async () => {
  const { data } = await axiosInstance.get("/resumes");
  return data;
};

// Get Resume By ID
export const getResumeById = async (id) => {
  const { data } = await axiosInstance.get(`/resumes/${id}`);
  return data;
};

// Delete Resume
export const deleteResume = async (id) => {
  const { data } = await axiosInstance.delete(`/resumes/${id}`);
  return data;
};