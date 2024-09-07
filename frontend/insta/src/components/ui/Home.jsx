import React from 'react'
import Feed from '../Feed'
import { Outlet } from 'react-router-dom'
import RightSidebar from '../RightSidebar'
import useGetAllPost from '@/hooks/useGetAllPost'
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers'
import Stories from '../Stories'
import useGetAllStory from '@/hooks/useGetAllStory'

const Home = () => {
  useGetSuggestedUsers()
  useGetAllPost()
  useGetAllStory()
  return (
    <div className='flex '>
      <div className=' ml-48  flex-grow mx-auto bg-[#F0F2F5]  '>
        <Feed />
        <Outlet />
      </div>
      <RightSidebar />
    </div>
  )
}

export default Home