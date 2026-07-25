// api/companyApi.js
import axiosInstance from "./axiosInstance";

export const searchCompanies = async (query) => {
  const { data } = await axiosInstance.get("/companies/search", {
    params: { query },
  });
  return data; // plain array
};

export const getAllCompanies = async () => {
  const { data } = await axiosInstance.get("/companies");
  return data; // plain array
};

export const updateCompany = async (id, updates) => {
  const { data } = await axiosInstance.put(`/companies/${id}`, updates);
  return data;
};

export const deleteCompany = async (id) => {
  const { data } = await axiosInstance.delete(`/companies/${id}`);
  return data;
};