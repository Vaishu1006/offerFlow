import axiosInstance from './axiosInstance';

export const addToWishlist=async(wishListData)=>{
    const {data}=await axiosInstance.post('/wishlist', wishListData);
    return data;
}

export const getWishlist=async()=>{
    const {data}=await axiosInstance.get('/wishlist');
    return data;
}

export const updateWishlistStatus=async(id, status)=>{
    const {data}=await axiosInstance.put(`/wishlist/${id}`, {status});
    return data;
}

export const removeFromWishlist=async(id)=>{
    const {data}=await axiosInstance.delete(`/wishlist/${id}`);
    return data;
}