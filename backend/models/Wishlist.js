import mongoose from "mongoose";

const wishlistSchema=new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        index:true
    },
    company_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Company",
        required:true
    },
    role: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    status: {
      type: String,
      enum: [
        "Saved",
        "Applied",
        "OA Scheduled",
        "OA Cleared",
        "Interview Round 1",
        "Interview Round 2",
        "HR Round",
        "Selected",
        "Rejected",
      ],
      default: "Saved",
    },
},{timestamps:true});

wishlistSchema.index({ user_id: 1, company_id: 1, role: 1 }, { unique: true });

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
export default Wishlist; 