import { Story } from "../models/story.model.js";
import { User } from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.handler.js";

export const createStory = async (req, res) => {
  try {
    const { type, caption } = req.body;
    const userId = req.id;
    
    // Validate required fields
    if (!userId || !req.file) {
      return res.status(400).json({ message: 'User ID and media file are required.' });
    }

    // Check if the user exists
    const userExists = await User.exists({ _id: userId });
    if (!userExists) {
      return res.status(404).json({ message: 'Author not found.' });
    }

    // Create and save the new story
    const newStory = new Story({ media: req.file.path, type, author: userId, caption });
    const savedStory = await newStory.save();

    return res.status(200).json({
      savedStory,
      success: true
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getAllStorys = async (req, res) => {
  try {
    const now = new Date(); // Get current date and time
    console.log(now)
    // Find stories where the expiresAt is either null or in the future
    const stories = await Story.find({
      expiresAt: { $gte: now } // ExpiresAt is in the future or has not been set
    });
    return res.status(200).json({
      message: 'Stories retrieved successfully',
      success: true,
      stories
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const addViewToStory = async (req, res) => {
  const { storyId } = req.params;
  const userId = req.id;

  try {
    // Find the story and update the viewers list
    const story = await Story.findById(storyId);

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }
    let savedStory
    // Add userId to the viewers list if not already present
    // if (!story.viewers.includes(userId)) {
      story.viewers.push(userId);
      savedStory = await story.save();
    // }

    return res.status(200).json({
        savedStory,
        message: 'View added successfully',
        success: true
    })
} catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

