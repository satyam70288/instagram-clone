import React from 'react'
import PostData from './PostData'
import { useSelector } from 'react-redux'

const Posts = () => {
  const {posts} = useSelector(store=>store.post);
  return (
    <div className=' bg-black w-full flex flex-col items-center justify-center flex-wrap'>
       <div>
       {
            posts.map((post) => <PostData key={post._id} post={post}/>)
        }
       </div>
    </div>
  )
}

export default Posts