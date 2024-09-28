import React, { useEffect } from 'react'
import SignUp from './components/ui/SignUp'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainLayout from './components/ui/MainLayout'
import Home from './components/ui/Home'
import Login from './components/ui/Login'
import Profile from './components/Profile'
import EditProfile from './components/EditProfile'
import ChatPage from './components/ChatPage'
import { io } from 'socket.io-client'
import { useDispatch, useSelector } from 'react-redux'
import { setSocket } from './redux/socketSlice'
import { setOnlineUsers } from './redux/chatSlice'
import { setLikeNotification } from './redux/rtnSlice'
import ProtectedRoutes from './components/ProtectedRoutes'
import ReelsPage from './components/ReelsPage'
import Explore from './components/Explore'
import Followers from './components/Followers'
import Following from './components/Following'
import ExploreDetails from './components/ExploreDetails'
import NotificationPage from './components/NotificationPage'
const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoutes><MainLayout /></ProtectedRoutes>,
    children: [
      {
        path: '/',
        element: <ProtectedRoutes><Home /></ProtectedRoutes>
      },
      {
        path: '/profile/:id',
        element: <ProtectedRoutes> <Profile /></ProtectedRoutes>
      },
      {
        path: '/account/edit',
        element: <ProtectedRoutes><EditProfile /></ProtectedRoutes>
      },
      {
        path: '/chat',
        element: <ProtectedRoutes><ChatPage /></ProtectedRoutes>
      },
      {
        path: '/reels',
        element: <ProtectedRoutes><ReelsPage /></ProtectedRoutes>
      },
      {
        path: '/explore',
        element: <ProtectedRoutes><Explore /></ProtectedRoutes>
      },
      {
        path: 'profile/:id/followers',
        element: <ProtectedRoutes><Followers /></ProtectedRoutes>
      },
      {
        path: 'profile/:id/following',
        element: <ProtectedRoutes><Following /></ProtectedRoutes>
      },
      {
        path: 'post/:id',
        element: <ProtectedRoutes><ExploreDetails /></ProtectedRoutes>
      },
      {
        path: 'notifications',
        element: <ProtectedRoutes><NotificationPage /></ProtectedRoutes>
      },

    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <SignUp />
  },
])


const App = () => {
  const { user } = useSelector((state) => state.auth);
  const { socket } = useSelector(store => store.socketio);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const socketio = io('http://localhost:8000', {
        query: {
          userId: user?._id
        },
        transports: ['websocket']
      });
      dispatch(setSocket(socketio));

      // listen all the events
      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      socketio.on('notification', (notification) => {
        console.log(notification)
        dispatch(setLikeNotification(notification));
      });

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      }
    } else if (socket) {
      socket.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);

  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  )
}

export default App