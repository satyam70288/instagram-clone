import React from 'react';
import { useSelector } from 'react-redux';

const Explore = () => {
  const { posts } = useSelector(store => store.post)
  const data = [
    { id: 1, content: 'Satyam', bgColor: 'bg-red-200', imgSrc: 'https://via.placeholder.com/150', highlighted: true },
    { id: 2, content: 'Bharti', bgColor: 'bg-orange-400', imgSrc: 'https://via.placeholder.com/150', highlighted: false },
    { id: 3, content: 'Satyam', bgColor: 'bg-blue-400', imgSrc: 'https://via.placeholder.com/150', highlighted: false },
    { id: 4, content: 'Satyam', bgColor: 'bg-red-200', imgSrc: 'https://via.placeholder.com/150', highlighted: false },
    { id: 5, content: 'Bharti', bgColor: 'bg-orange-400', imgSrc: 'https://via.placeholder.com/150', highlighted: false },
    { id: 6, content: 'Satyam', bgColor: 'bg-blue-400', imgSrc: 'https://via.placeholder.com/150', highlighted: false },
    { id: 7, content: 'Satyam', bgColor: 'bg-red-200', imgSrc: 'https://via.placeholder.com/150', highlighted: false },
    { id: 8, content: 'Bharti', bgColor: 'bg-orange-400', imgSrc: 'https://via.placeholder.com/150', highlighted: false },
    { id: 9, content: 'Satyam', bgColor: 'bg-blue-400', imgSrc: 'https://via.placeholder.com/150', highlighted: false },
    { id: 10, content: 'Satyam', bgColor: 'bg-blue-400', imgSrc: 'https://via.placeholder.com/150', highlighted: false },
    { id: 11, content: 'Satyam', bgColor: 'bg-red-200', imgSrc: 'https://via.placeholder.com/150', highlighted: false },
    { id: 12, content: 'Bharti', bgColor: 'bg-orange-400', imgSrc: 'https://via.placeholder.com/150', highlighted: false },
    { id: 13, content: 'Satyam', bgColor: 'bg-blue-400', imgSrc: 'https://via.placeholder.com/150', highlighted: false },
    { id: 14, content: 'Bharti', bgColor: 'bg-orange-400', imgSrc: 'https://via.placeholder.com/150', highlighted: false },
    { id: 15, content: 'Satyam', bgColor: 'bg-blue-400', imgSrc: 'https://via.placeholder.com/150', highlighted: false },
    { id: 16, content: 'Satyam', bgColor: 'bg-blue-400', imgSrc: 'https://via.placeholder.com/150', highlighted: false },
    { id: 17, content: 'Satyam', bgColor: 'bg-red-200', imgSrc: 'https://via.placeholder.com/150', highlighted: false },
    { id: 18, content: 'Bharti', bgColor: 'bg-orange-400', imgSrc: 'https://via.placeholder.com/150', highlighted: false },
    { id: 19, content: 'Satyam', bgColor: 'bg-blue-400', imgSrc: 'https://via.placeholder.com/150', highlighted: false },
  ];

  return (
    <div className="ml-[16%] w-[calc(100%-16%)]  h-screen overflow-y-auto bg-red-300">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 p-2 bg-black">
        {posts.map((item) => (
          <div
            key={item.id}
            className=' relative bg-slate-400 h-60 group hover:bg-red-500 hover:scale-110 hover:shadow-lg transition-all duration-300 ease-in-out border hover:z-10 '
          // className={`relative ${item.bgColor} p-4 ${item.highlighted ? 'border-4 border-yellow-500' : ''}`}
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

            {/* <p className="text-center">{item.content}</p> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explore;
