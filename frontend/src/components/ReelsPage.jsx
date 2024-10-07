import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ReactPlayer from 'react-player';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Button } from './ui/button';
import { FaRegHeart } from 'react-icons/fa';
import { Bookmark, MessageCircle, ArrowDownToLine } from 'lucide-react';

const videoData = [
  {
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    username: "satyam",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
  },
  {
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    username: "john_doe",
    avatar: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80",
  },
  {
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    username: "movie_buff",
    avatar: "https://images.unsplash.com/photo-1591233434201-8ad5cdd7d0a1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
  },
];

const ReelsPage = () => {
  const { menu } = useSelector((store) => store.menu);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const handleNextVideo = () => {
    // Update the index to the next video, looping back if at the end
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videoData.length);
  };

  return (
    <div
      className={`${menu ? 'ml-[5%] w-[calc(100%-5%)]' : 'ml-[16%] w-[calc(100%-16%)]'} 
      transition-all duration-500 bg-gray-900 h-screen overflow-y-auto relative`}
    >
      {/* Down Arrow Button */}
      <ArrowDownToLine
        size={36}
        className="text-white bg-red-300 z-10 fixed bottom-10 right-10 cursor-pointer"
        onClick={handleNextVideo} // Update video when clicked
      />
      
      {/* Video Container */}
      <div className="flex items-center justify-center w-full py-10">
        <div className="relative w-[30vw] h-[100vh] flex items-center justify-center bg-zinc-900 rounded-lg overflow-hidden shadow-lg">
          {/* Current Video Player */}
          <ReactPlayer
            url={videoData[currentVideoIndex].url} // Set the video URL based on current index
            playing
            loop
            muted
            width="100%"
            height="100%"
            className="object-cover"
          />

          {/* Overlay for Avatar and User Info */}
          <div className="absolute bottom-4 left-4 z-10 flex items-center gap-3 text-white">
            <Avatar className="w-10 h-10">
              <AvatarImage src={videoData[currentVideoIndex].avatar} alt={videoData[currentVideoIndex].username} className="rounded-full" />
              <AvatarFallback>{videoData[currentVideoIndex].username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <h1 className="font-bold text-lg">{videoData[currentVideoIndex].username}</h1>
            <Button className="h-8 bg-blue-600 rounded-md">Follow</Button>
          </div>

          {/* Vertical Action Icons */}
          <div className="absolute right-4 bottom-20 flex flex-col items-center gap-4 text-white">
            <FaRegHeart size={24} className="cursor-pointer" />
            <MessageCircle size={24} className="cursor-pointer" />
            <Bookmark size={24} className="cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReelsPage;
