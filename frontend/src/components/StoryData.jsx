import React, { useState } from 'react';
import { Button } from './ui/button';
import { PlusCircle } from 'lucide-react';
import CreateStory from './CreateStory';
import { useDispatch, useSelector } from 'react-redux';
import ViewStory from './ViewStory';
import { setStories } from '@/redux/storySlice';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';

const StoryData = () => {
  const [openCreateStory, setOpenCreateStory] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [viewStoryOpen, setViewStoryOpen] = useState(false);
  // const [viewStory, setViewStory] = useState(stories?.viewers);
  const { stories } = useSelector((state) => state.story);
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleStoryClick = (story) => {
    console.log(story)
    setSelectedStory(story);
    setViewStoryOpen(true);
  };
  const viewStoryHandler = async (storyId) => {
    try {
      const res = await axios.post(`https://instagram-clone-8h2b.onrender.com/api/v1/story/view/${storyId}`, {}, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }

      });

      if (res.data.success) {
        dispatch(setStories(stories.map(story =>
          story._id === storyId
            ? { ...story, viewers: res.data.savedStory.viewers }
            : story
        )));
        toast.success(res.data.message);
        navigate('/'); // Redirect to the homepage or another route
      } else {
        toast.error('Failed to view story.');
      }
    } catch (error) {
      console.error('Error viewing story:', error);
      toast.error(error.response?.data?.message || 'An unexpected error occurred.');
    }
  };


  return (
    <div className='flex items-center gap-4 p-4 overflow-x-auto hide-scrollbar bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-md shadow-lg w-full'
      style={{
        scrollbarWidth: 'none', /* Firefox */
        msOverflowStyle: 'none', /* IE and Edge */
      }}
    >
      <div className='flex-shrink-0'>
        {/* PlusCircle button to create a new story */}
        <PlusCircle className='text-white bg-black p-1 rounded-full shadow-lg cursor-pointer transition-transform transform hover:scale-110' onClick={() => setOpenCreateStory(true)} size={75} />
      </div>
      <CreateStory open={openCreateStory} setOpen={setOpenCreateStory} />

      {/* Story items */}
      <div className='flex space-x-4'>
        {stories.map((story, index) => (
          <div key={index} className='flex-shrink-0 '>
            <div
              className='w-20 h-20 p-1 border border-white bg-gradient-to-r from-yellow-400 to-red-400 rounded-full shadow-lg overflow-hidden transition-transform transform hover:scale-105 cursor-pointer'
              onClick={() => {
                handleStoryClick(story);
                viewStoryHandler(story._id); // Pass the story ID to viewStoryHandler
              }}
            >
              <img
                src={`https://instagram-clone-8h2b.onrender.com/${story?.media}`}
                alt="Story"
                className='w-full h-full object-cover rounded-full'
              />
            </div>
          </div>
        ))}
      </div>
      <ViewStory open={viewStoryOpen} setOpen={setViewStoryOpen} story={selectedStory} />
    </div>
  );
};

export default StoryData;
