// api/aiApi.js
import axiosInstance from "./axiosInstance";

export const analyzeApplication = async (payload) => {
  const { data } = await axiosInstance.post("/ai/analyze", payload);
  return data; // { success, analysis }
};

export const getAnalysisByApplication = async (applicationId) => {
  const { data } = await axiosInstance.get(`/ai/analysis/${applicationId}`);
  return data; // { success, analysis }
};