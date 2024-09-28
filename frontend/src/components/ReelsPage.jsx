import React from 'react';
import ReactPlayer from 'react-player';  // Import ReactPlayer
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Bookmark, MessageCircle } from 'lucide-react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { Button } from './ui/button';

const ReelsPage = () => {
  return (
    <div className='ml-[16%] w-[calc(100%-16%)] bg-gray-900 h-screen flex justify-center items-center'>
      <div className='relative w-80 h-[70vh] bg-slate-600 rounded-lg overflow-hidden'>
        {/* Use ReactPlayer for video */}
        <ReactPlayer
          url="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          playing
          loop
          muted
          width="100%"
          height="100%"
          className="absolute inset-0 object-cover"  // Use inset-0 for full coverage
        />

        {/* Content on top of the video */}
        <div className='relative z-10 flex justify-between items-end h-full p-4'>
          <div className='flex items-center gap-3'>
            <Avatar className='w-8 h-8'>
              <AvatarImage
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                alt="avatar"
                className='rounded-full'
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <h1 className='font-bold text-sm text-white mt-2'>satyam</h1>
            <Button className='h-6 bg-blue-600 rounded-md'>Follow</Button>
          </div>
          <div className='flex flex-col gap-8'>
            <FaRegHeart size={24} className='text-white' />
            <MessageCircle size={24} className='text-white' />
            <Bookmark size={24} className='text-white' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReelsPage;
