import { useState } from 'react';
import { useSelector } from 'react-redux';
import ReactPlayer from 'react-player';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Button } from './ui/button';
import { FaRegHeart } from 'react-icons/fa';
import { Bookmark, MessageCircle, ArrowDownToLine, MonitorUp } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const videoData = [
  {
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    username: "satyam",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=687&q=80",
  },
  {
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    username: "john_doe",
    avatar: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=1350&q=80",
  },
  {
    url: "https://assets.mixkit.co/videos/preview/mixkit-small-waterfall-in-the-forest-2210-large.mp4",
    username: "movie_buff",
    avatar: "https://images.unsplash.com/photo-1591233434201-8ad5cdd7d0a1?auto=format&fit=crop&w=687&q=80",
  },
];

const ReelsPage = () => {
  const { menu } = useSelector((store) => store.menu);
  const { guest } = useSelector((store) => store.auth);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const navigate = useNavigate();

  const requireAccount = (action = 'use this') => {
    toast.info(`Log in to ${action}.`);
    if (guest) navigate('/login');
  };

  const handleNextVideo = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videoData.length);
  };

  return (
    <div
      className={`${menu ? 'ml-0 lg:ml-[6%] lg:w-[calc(100%-6%)]' : 'ml-0 lg:ml-[16%] lg:w-[calc(100%-16%)]'} 
      transition-all duration-500 bg-slate-950 min-h-screen overflow-y-auto relative`}
    >
      <div className="absolute top-6 right-6 z-10 flex flex-col items-center text-white">
        <MonitorUp onClick={() => toast.info('Reel uploads are coming soon.')} size={36} className="cursor-pointer" />
        <h1 className="text-sm mt-1">Upload Reels</h1>
        <p className="mt-1 text-xs text-white/60">Demo player for now</p>
      </div>

      <ArrowDownToLine
        size={36}
        className="text-white bg-violet-600 rounded-full p-2 z-10 fixed bottom-24 right-6 lg:bottom-10 lg:right-10 cursor-pointer"
        onClick={handleNextVideo}
      />

      <div className="flex items-center justify-center w-full py-10 px-4">
        <div className="relative w-full max-w-sm h-[80vh] flex items-center justify-center bg-zinc-900 rounded-2xl overflow-hidden shadow-lg">
          <ReactPlayer
            url={videoData[currentVideoIndex].url}
            playing
            loop
            muted
            width="100%"
            height="100%"
            className="object-cover"
          />

          <div className="absolute bottom-4 left-4 z-10 flex items-center gap-3 text-white">
            <Avatar className="w-10 h-10 rounded-full overflow-hidden">
              <AvatarImage src={videoData[currentVideoIndex].avatar} alt={videoData[currentVideoIndex].username} className="rounded-full" />
              <AvatarFallback>{videoData[currentVideoIndex].username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <h1 className="font-bold text-lg">{videoData[currentVideoIndex].username}</h1>
            <Button className="h-8 bg-violet-600 rounded-md" onClick={() => requireAccount('follow creators')}>
              {guest ? 'Log in' : 'Follow'}
            </Button>
          </div>

          <div className="absolute right-4 bottom-20 flex flex-col items-center gap-4 text-white">
            <FaRegHeart size={24} className="cursor-pointer" onClick={() => requireAccount('like reels')} />
            <MessageCircle size={24} className="cursor-pointer" onClick={() => requireAccount('comment')} />
            <Bookmark size={24} className="cursor-pointer" onClick={() => requireAccount('save reels')} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReelsPage;
