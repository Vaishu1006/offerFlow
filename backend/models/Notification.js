import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true 
    },
    noti_type: {
        type: String,
        required: true,
        enum: ['job_alert', 'message', 'profile_update', 'application_status', 'saved_job']
    },
    scheduled_date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'sent', 'failed', 'read'],
        default: 'pending'
    }
}, { timestamps: true });

// Index for efficient queries
notificationSchema.index({ user_id: 1, createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;