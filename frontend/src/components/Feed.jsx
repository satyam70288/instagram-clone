import React from 'react';
import Posts from './Posts';
import Stories from './Stories';
import { useSelector } from 'react-redux';

const Feed = () => {
  const { menu } = useSelector(store => store.menu)

  return (
<div
  className={`flex-1 ml-0 ${menu ? 
    ' lg:ml-[8%] lg:w-[calc(100%-6%)]' 
    : 
    ' lg:ml-[20%] lg:w-[calc(100%-20%)]'
  } bg-black flex flex-col items-center justify-center`}
>
  <Stories />
  <Posts />
</div>

  );
};

export default Feed;
