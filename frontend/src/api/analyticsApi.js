import axiosInstance from './axiosInstance';

export const getDashboardStats=async()=>{
    const { data }=await axiosInstance.get("/analytics/dashboard");
    return data;
}

export const getApplicationsByCompany=async()=>{
    const { data }=await axiosInstance.get("/analytics/applications-by-company");
    return data;
}

export const getApplicationsTrend=async()=>{
    const { data }=await axiosInstance.get("/analytics/applications-trend");
    return data;
}

export const getMyStats=async()=>{
    const { data }=await axiosInstance.get("/analytics/my-stats");
    return data;
}