import React, { useEffect } from 'react'
import Feed from '../Feed'
import { Outlet, useNavigate } from 'react-router-dom'
import RightSidebar from '../RightSidebar'
import useGetAllPost from '@/hooks/useGetAllPost'
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers'
import Stories from '../Stories'
import useGetAllStory from '@/hooks/useGetAllStory'
import Cookies from 'js-cookie';
import { removeAuthUser, setAuthUser } from '@/redux/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import SearchPage from '../SearchPage'
import { useNotificationQuery } from '@/services/api'
import useGetAllNotification from '@/hooks/useGetAllNotification'

const Home = () => {
  useGetAllNotification()
  useGetSuggestedUsers()
  useGetAllPost()
  useGetAllStory()
  const navigate=useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector(store => store.auth)
  const logOutHandler = async () => {
    try {
        const res = await axios.get('http://localhost:8000/api/v1/user/logout', { withCredentials: true });
        if (res.data.success) {
            dispatch(setAuthUser(null));
            dispatch(setSelectedPost(null));
            dispatch(setPosts([]));
            navigate('/login');
            toast.success(res.data.message);
        }
    } catch (error) {
        console.log(error.response)
        toast.error(error.response?.data?.message || 'Logout failed');
    }
};
useEffect(() => {
  const checkExpiration = () => {
    if (user && user.lastLoginAt) {
      const currentTime = Date.now();
      const lastLoginTime = new Date(user.lastLoginAt).getTime();
      const expirationTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      console.log(currentTime, lastLoginTime, expirationTime);
      console.log("Checking expiration");
      if (currentTime - lastLoginTime > expirationTime) {
        logOutHandler(); // Remove the user if 24 hours have passed
        console.log("User session expired, removing user.");
      }
    }
  };

  // Run the expiration check immediately
  checkExpiration();

  // Set an interval to run the expiration check every 5 seconds
  const intervalId = setInterval(checkExpiration, 500000);

  // Cleanup the interval on component unmount
  return () => clearInterval(intervalId);
}, [user]); // Add 'user' as a dependency




  return (
    <div className='flex flex-col sm:flex-row'>
      <div className='bg-black sm:bg-[#F0F2F5] w-full sm:w-auto ml-0 md:ml-0 lg:ml-48 flex-grow'>
        <Feed />
        <Outlet />
      </div>
      <RightSidebar />
    </div>
  )
}

export default Home
