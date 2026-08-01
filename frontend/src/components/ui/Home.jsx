import { useEffect } from 'react'
import Feed from '../Feed'
import { Outlet } from 'react-router-dom'
import RightSidebar from '../RightSidebar'
import useGetAllPost from '@/hooks/useGetAllPost'
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers'
import useGetAllStory from '@/hooks/useGetAllStory'
import { useSelector } from 'react-redux'
import useGetAllNotification from '@/hooks/useGetAllNotification'

const Home = () => {
  useGetAllNotification()
  useGetSuggestedUsers()
  useGetAllPost()
  useGetAllStory()
  const { menu } = useSelector(store => store.menu)

  // Token expiry redirect is handled globally by ProtectedRoutes + axios interceptor

  return (
    <div className={`flex min-h-screen transition-all duration-300 ${menu ? 'lg:ml-[6%]' : 'lg:ml-[16%]'}`}>
      <div className='min-w-0 flex-1'>
        <Feed />
        <Outlet />
      </div>
      <RightSidebar />
    </div>
  )
}

export default Home
