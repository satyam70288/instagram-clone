import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import CreateStory from './CreateStory';
import { useDispatch, useSelector } from 'react-redux';
import ViewStory from './ViewStory';
import { setStories } from '@/redux/storySlice';
import { resolveMediaUrl } from '@/lib/media';
import { toast } from 'sonner';
import axios from 'axios';

const StoryData = () => {
  const [openCreateStory, setOpenCreateStory] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [viewStoryOpen, setViewStoryOpen] = useState(false);
  // const [viewStory, setViewStory] = useState(stories?.viewers);
  const { stories } = useSelector((state) => state.story);
  const { guest, suggestedUsers } = useSelector((state) => state.auth);
  const displayStories = guest
    ? suggestedUsers.map((person) => ({ _id: person._id, media: person.profilePicture, username: person.username }))
    : stories;
  const dispatch = useDispatch()

  const handleStoryClick = (story) => {
    console.log(story)
    setSelectedStory(story);
    setViewStoryOpen(true);
  };
  const viewStoryHandler = async (storyId) => {
    if (guest) return;
    try {
      const res = await axios.post(`/api/v1/story/view/${storyId}`, {}, {
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
      }
    } catch (error) {
      console.error('Error viewing story:', error);
    }
  };


  return (
    <div className='flex w-full items-center gap-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'
      style={{
        scrollbarWidth: 'none', /* Firefox */
        msOverflowStyle: 'none', /* IE and Edge */
      }}
    >
      <div className='flex-shrink-0'>
        {/* PlusCircle button to create a new story */}
        <button onClick={() => guest ? toast.info('Log in to share your story.') : setOpenCreateStory(true)} className='flex w-16 flex-col items-center gap-1.5 text-xs font-medium text-slate-500'>
          <span className='grid h-14 w-14 place-items-center rounded-full border-2 border-dashed border-violet-300 bg-violet-50 text-violet-600'><PlusCircle size={24}/></span>
          Your story
        </button>
      </div>
      <CreateStory open={openCreateStory} setOpen={setOpenCreateStory} />

      {/* Story items */}
      <div className='flex space-x-4'>
        {displayStories.map((story, index) => (
          <div key={story._id || index} className='flex flex-shrink-0 flex-col items-center gap-1.5'>
            <div
              className='h-14 w-14 cursor-pointer overflow-hidden rounded-full bg-gradient-to-tr from-amber-400 via-pink-500 to-violet-600 p-[2px] transition-transform hover:scale-105'
              onClick={() => {
                handleStoryClick(story);
                viewStoryHandler(story._id); // Pass the story ID to viewStoryHandler
              }}
            >
              <img
                src={resolveMediaUrl(story?.media)}
                alt="Story"
                className='h-full w-full rounded-full border-2 border-white object-cover'
              />
            </div>
            <span className='max-w-16 truncate text-xs text-slate-600'>{story.username || 'Story'}</span>
          </div>
        ))}
      </div>
      <ViewStory open={viewStoryOpen} setOpen={setViewStoryOpen} story={selectedStory} />
    </div>
  );
};

export default StoryData;
