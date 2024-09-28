import React from 'react'
import PostData from './PostData'
import { useSelector } from 'react-redux'

const Posts = () => {
  const {posts} = useSelector(store=>store.post);
  return (
    <div className=''>
        {
            posts.map((post) => <PostData key={post._id} post={post}/>)
        }
    </div>
  )
}

export default Posts