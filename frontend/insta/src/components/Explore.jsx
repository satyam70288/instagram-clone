import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Explore = () => {
  const { posts } = useSelector(store => store.post);

  return (
    <div className="ml-[16%] w-[calc(100%-16%)] h-screen overflow-y-auto bg-red-300">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 p-2 bg-black">
        {posts.map((item) => (
          <Link
            key={item._id}
            to={`/post/${item._id}`} // Change this path based on your routing setup
            className="relative bg-slate-400 h-60 group hover:bg-red-500 hover:scale-110 hover:shadow-lg transition-all duration-300 ease-in-out border hover:z-10"
          >
            <img
              src={`http://localhost:8000/${item?.image.replace(/\\/g, '/')}`}
              alt={item.content}
              className="h-full object-cover w-full"
            />
            <div className="absolute inset-0 bg-white bg-opacity-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-white text-xl font-bold">{item.content}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Explore;
