import React from 'react'
import Posts from './Posts'
import Stories from './Stories'

const Feed = () => {
  return (
    <div className='flex-1 bg-black flex flex-col items-center mx-auto  '>
        <Stories/>
        <Posts/>
    </div>
  )
}

export default Feed