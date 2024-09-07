
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { toast } from 'sonner';
import axios from 'axios';
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers';
import { setSuggestedUsers } from '@/redux/authSlice';

const SuggestedUsers = () => {
    const { suggestedUsers, user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    useGetSuggestedUsers()

    const folooworUnFollowHandler = async (id) => {
        try {
            const res = await axios.post(`http://localhost:8000/api/v1/user/followorunfollow/${id}`, {}, {
                withCredentials: true
            });

            if (res.data.success) {

                const updatedSuggestedUsers = suggestedUsers.map(userData =>
                    userData._id === id
                        ? {
                            ...userData,
                            followers: userData.followers.includes(user._id)
                                ? userData.followers.filter(followerId => followerId !== user._id) // Unfollow: remove user._id
                                : [...userData.followers, user._id] // Follow: add user._id
                        }
                        : userData
                );
                dispatch(setSuggestedUsers(updatedSuggestedUsers)); // Update state
                toast.success(res.data.message);
                // navigate('/');
            } else {
                toast.error('Failed to create story.');
            }
        } catch (error) {
            console.error('Error creating story:', error); // Log errors
            toast.error(error.response?.data?.message || 'An unexpected error occurred.');
        }
    };

    return (
        <div className='my-6 bg-[#F7F8FA] w-[100%] h-[60vh] overflow-y-auto overflow-hidden p-4 rounded-md  scrollbar-hide'
            style={{
                scrollbarWidth: 'none', /* Firefox */
                msOverflowStyle: 'none', /* IE and Edge */
            }}
        >
            <div className='flex items-center justify-between text-sm gap-7'>
                <h1 className='font-semibold text-gray-600'>Suggested for you</h1>
                <span className='font-medium cursor-pointer'>See All</span>
            </div>
            {
                suggestedUsers.map((userData) => {
                    const isFollowing = userData.followers.includes(user._id)
                    return (
                        <div key={userData._id} className='flex items-center justify-between my-5'>
                            <div className='flex items-center gap-2'>
                                <Link to={`/profile/${userData?._id}`}>
                                    <Avatar>
                                        <AvatarImage src={userData?.profilePicture} alt="post_image" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div>
                                    <h1 className='font-semibold text-sm'><Link to={`/profile/${userData?._id}`}>{userData?.username}</Link></h1>
                                    <span className='text-gray-600 text-sm'>{userData?.bio || 'Bio here...'}</span>
                                </div>
                            </div>
                            <span className={`${isFollowing ? "text-red-500" : "text-[#3BADF8]"} text-xs font-bold cursor-pointer hover:text-[#3495d6] `} onClick={() => folooworUnFollowHandler(userData?._id)}>{isFollowing ? 'unfollow' : 'Follow'}</span>
                        </div>
                    )
                })
            }

        </div>
    )
}

export default SuggestedUsers
