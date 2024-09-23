import React from 'react'
import Posts from './Posts'
import Stories from './Stories'

const Feed = () => {
  return (
    <div className='flex-1 bg-black flex flex-col items-center w-full sm:w-full md:w-auto'>
        <Stories/>
        <Posts/>
    </div>
  )
}

export default Feed
