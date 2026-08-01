import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import useGetUserProfile from '@/hooks/useGetUserProfile';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AtSign, Heart, MessageCircle } from 'lucide-react';
import { setSelectedUser, setUserProfile } from '@/redux/authSlice';
import { toast } from 'sonner';
import axios from 'axios';
import { resolveMediaUrl } from '@/lib/media';

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  const navigate = useNavigate();
  useGetUserProfile(userId);
  const [activeTab, setActiveTab] = useState('posts');
  const dispatch = useDispatch()
  const { userProfile, user, guest } = useSelector(store => store.auth);

  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const isFollowing = userProfile?.followers?.includes(user?._id)

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  }
  const isVideo = (url) => url?.endsWith('.mp4') || url?.endsWith('.mov') || url?.endsWith('.avi');

  const folooworUnFollowHandler = async (id) => {
    if (guest) {
      toast.info('Log in to follow people.');
      navigate('/login');
      return;
    }
    try {
      const res = await axios.post(`/api/v1/user/followorunfollow/${id}`, {}, {
        withCredentials: true
      });

      if (res.data.success) {
        const isCurrentlyFollowing = userProfile?.followers?.includes(user._id);
        const updatedFollowers = isCurrentlyFollowing
          ? userProfile.followers.filter(followerId => followerId !== user._id)
          : [...(userProfile.followers || []), user._id];

        dispatch(setUserProfile({
          ...userProfile,
          followers: updatedFollowers
        }));
        toast.success(res.data.message);
      } else {
        toast.error('Failed to follow/unfollow user.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An unexpected error occurred.');
    }
  };

  const openMessage = () => {
    if (guest) {
      toast.info('Log in to send messages.');
      navigate('/login');
      return;
    }
    dispatch(setSelectedUser(userProfile));
    navigate('/chat');
  };

  const displayedPost = activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks;

  if (guest && userId === 'guest') {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center gap-4 p-8'>
        <p className='text-slate-600'>Guest profiles are read-only demos.</p>
        <Button onClick={() => navigate('/login')}>Log in for a real profile</Button>
      </div>
    );
  }

  return (
    <div className='flex max-w-5xl justify-center mx-auto pl-4 lg:pl-10 lg:ml-[16%]'>
      <div className='flex flex-col gap-20 p-8 w-full'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <section className='flex items-center justify-center'>
            <Avatar className='h-32 w-32'>
              <AvatarImage
                src={resolveMediaUrl(userProfile?.profilePicture)}
                alt="profile photo"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className='flex flex-col gap-5'>
              <div className='flex flex-wrap items-center gap-2'>
                <span className='text-xl font-semibold'>{userProfile?.username}</span>
                {
                  isLoggedInUserProfile ? (
                    <>
                      <Link to="/account/edit"><Button variant='secondary' className='hover:bg-gray-200 h-8'>Edit profile</Button></Link>
                    </>
                  ) : (
                    isFollowing ? (
                      <>
                        <Button variant='secondary' className='h-8' onClick={() => folooworUnFollowHandler(userId)}>Unfollow</Button>
                        <Button variant='secondary' className='h-8' onClick={openMessage}>Message</Button>
                      </>
                    ) : (
                      <Button className='bg-violet-600 hover:bg-violet-700 h-8' onClick={() => folooworUnFollowHandler(userId)}>
                        {guest ? 'Log in to follow' : 'Follow'}
                      </Button>
                    )
                  )
                }
              </div>
              <div className='flex items-center gap-4'>
                <p><span className='font-semibold'>{userProfile?.posts?.length || 0} </span>posts</p>
                <Link to={`/profile/${userId}/followers`}><p><span className='font-semibold'>{userProfile?.followers?.length || 0} </span>followers</p></Link>
                <Link to={`/profile/${userId}/following`}><p><span className='font-semibold'>{userProfile?.following?.length || 0} </span>following</p></Link>
              </div>
              <div className='flex flex-col gap-1'>
                <span className='font-semibold'>{userProfile?.bio || 'bio here...'}</span>
                <Badge className='w-fit' variant='secondary'><AtSign /> <span className='pl-1'>{userProfile?.username}</span> </Badge>
              </div>
            </div>
          </section>
        </div>
        <div className='border-t border-t-gray-200'>
          <div className='flex items-center justify-center gap-10 text-sm'>
            <span className={`py-3 cursor-pointer ${activeTab === 'posts' ? 'font-bold' : ''}`} onClick={() => handleTabChange('posts')}>
              POSTS
            </span>
            <span className={`py-3 cursor-pointer ${activeTab === 'saved' ? 'font-bold' : ''}`} onClick={() => handleTabChange('saved')}>
              SAVED
            </span>
          </div>
          <div className='grid grid-cols-3 gap-1'>
            {
              displayedPost?.map((post) => {
                return (
                  <Link to={`/post/${post?._id}`} key={post?._id} className='relative group cursor-pointer'>
                    {isVideo(post?.image) ? (
                      <video
                        className='rounded-md my-2 w-full aspect-square object-cover'
                        muted
                        src={resolveMediaUrl(post?.image)}
                        alt="post_video"
                      />
                    ) : (
                      <img
                        className='rounded-md my-2 w-full aspect-square object-cover'
                        src={resolveMediaUrl(post?.image)}
                        alt="post_image"
                      />
                    )}
                    <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                      <div className='flex items-center text-white space-x-4'>
                        <span className='flex items-center gap-2'>
                          <Heart />
                          <span>{post?.likes?.length}</span>
                        </span>
                        <span className='flex items-center gap-2'>
                          <MessageCircle />
                          <span>{post?.comments?.length}</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
