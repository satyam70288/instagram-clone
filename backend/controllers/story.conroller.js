import { Story } from "../models/story.model.js";
import { User } from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.handler.js";

export const createSory=async(req,res)=>{
    try {
        const { type,caption  } = req.body;
        const userId = req.id;
        if ( !userId) {return res.status(400).json({ message: 'Type and author are required' }) }
        if (!req.file) {   return res.status(400).json({ message: 'Media file is required' }) }
        const user = await User.findById(userId);
        if (!user) {return res.status(404).json({ message: 'Author not found' }) }
        const newStory = new Story({media: req.file.path,type,author:userId,caption});
        const savedStory = await newStory.save();
        return res.status(200).json({
            savedStory,
            success: true
        })
        } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }

}
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

