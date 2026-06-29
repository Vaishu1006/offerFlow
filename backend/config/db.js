import mongoose from "mongoose";
export const connectDB=async()=>{
    try {
        const conn=await mongoose.connect(process.env.MONGODB_URI);
    } catch (error) {
        console.log("Mognodb connection error", error);
         process.exit(1);
    }
};
