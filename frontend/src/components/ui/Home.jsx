import { useEffect } from 'react'
import Feed from '../Feed'
import { Outlet, useNavigate } from 'react-router-dom'
import RightSidebar from '../RightSidebar'
import useGetAllPost from '@/hooks/useGetAllPost'
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers'
import useGetAllStory from '@/hooks/useGetAllStory'
import { removeAuthUser } from '@/redux/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import useGetAllNotification from '@/hooks/useGetAllNotification'
import { clearAuthToken } from '@/lib/authStorage'

const Home = () => {
  useGetAllNotification()
  useGetSuggestedUsers()
  useGetAllPost()
  useGetAllStory()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user, guest } = useSelector(store => store.auth)
  const { menu } = useSelector(store => store.menu)

  const logOutHandler = async () => {
    try {
      await axios.get('/api/v1/user/logout', { withCredentials: true });
    } catch {
      // clear local session anyway
    }
    dispatch(removeAuthUser());
    dispatch(setSelectedPost(null));
    dispatch(setPosts([]));
    clearAuthToken();
    navigate('/login');
    toast.success('Session expired. Please log in again.');
  };

  useEffect(() => {
    if (guest || !user?.lastLoginAt) return;

    const checkExpiration = () => {
      const currentTime = Date.now();
      const lastLoginTime = new Date(user.lastLoginAt).getTime();
      const expirationTime = 24 * 60 * 60 * 1000;
      if (currentTime - lastLoginTime > expirationTime) {
        logOutHandler();
      }
    };

    checkExpiration();
    const intervalId = setInterval(checkExpiration, 21600000);
    return () => clearInterval(intervalId);
  }, [user, guest]);

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
