import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // The user receiving the notification
    type: { 
        type: String, 
        enum: ['like', 'comment', 'follow', 'post'],  // Types of notifications (can extend as needed)
        required: true 
    },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },  // Reference to the post (if applicable)
    comment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },  // Reference to the comment (if applicable)
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // The user who triggered the notification
    message: { type: String, default: '' },  // Optional message or description
    read: { type: Boolean, default: false },  // Whether the notification has been read
    createdAt: { type: Date, default: Date.now }
});

export const Notification = mongoose.model('Notification', notificationSchema);
