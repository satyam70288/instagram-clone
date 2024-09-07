import mongoose from "mongoose";

const reelSchema = new mongoose.Schema({
    video: { type: String, required: true }, // URL or path to the video file
    caption: { type: String, default: '' },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

export const Reel = mongoose.model('Reel', reelSchema);
