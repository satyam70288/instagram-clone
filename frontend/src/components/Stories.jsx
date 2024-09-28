import React from 'react';
import StoryData from './StoryData';
import { Heart, Home, LogOut, MessageCircle, Search } from 'lucide-react';

const Stories = () => {
  return (
    <div className='ml-[12%] w-[calc(100%-16%)]  from-pink-300 via-red-300 to-yellow-300 p-4'>
      <div className='w-full'>
        <div className='w-full' >
          <StoryData />
        </div>
      </div>
    </div>
  );
};

export default Stories;
