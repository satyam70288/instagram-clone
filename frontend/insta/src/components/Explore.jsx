import { useExplorePostQuery } from '@/services/api';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Explore = () => {
  const { data } = useExplorePostQuery();

  const isVideo = (url) => {
    // Check if URL ends with common video file extensions
    return url.endsWith('.mp4') || url.endsWith('.mov') || url.endsWith('.avi');
  };

  return (
    <div className="ml-[19%] w-[calc(100%-16%)] h-screen overflow-y-auto bg-gray-900">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 p-4">
        {data?.posts.map((item) => (
          <Link
            key={item._id}
            to={`/post/${item._id}`} // Change this path based on your routing setup
            className="relative block overflow-hidden rounded-lg shadow-lg transition-transform transform hover:scale-105"
          >
            {isVideo(item?.image) ? (
              <video
                className="w-full h-80 object-cover rounded-t-lg"
                controls
                src={`http://localhost:8000/${item?.image.replace(/\\/g, '/')}`}
                alt="post_video"
              />
            ) : (
              <img
                className="w-full h-80 object-cover rounded-t-lg"
                src={`http://localhost:8000/${item?.image.replace(/\\/g, '/')}`}
                alt="post_image"
              />
            )}
            <div className="absolute inset-0 bg-pink-50 bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <p className="text-white text-lg font-semibold p-2">{item.content}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Explore;
