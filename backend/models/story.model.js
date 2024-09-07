import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
    media: { type: String, required: true }, // URL or path to the image or video file
    type: { type: String, enum: ['image', 'video'],  }, // Specifies if it's an image or video
    caption: { type: String, default: '' },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    viewers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // List of users who viewed the story
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: () => Date.now() + 24*60*60*1000 } // Expires after 24 hours
}, { timestamps: true });

export const Story = mongoose.model('Story', storySchema);
