import { Avatar } from '@radix-ui/react-avatar';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { FaRegHeart } from "react-icons/fa";
import { ArrowLeft } from 'lucide-react';
import { useFollowOrUnfollowUserMutation } from '@/services/api';
import { toast } from 'sonner'
import { setPosts } from '@/redux/postSlice';

const ExploreDetails = () => {
    const params = useParams();
    const postId = params.id;
    const dispatch = useDispatch();

    const { posts } = useSelector((state) => state.post);
    const foundPost = posts.find(post => post._id === postId);
    const { user } = useSelector((state) => state.auth)

    const isCurrentlyFollowing = foundPost.author.followers.includes(user._id); // Ensure user._id is defined
    const [followOrUnfollowUser,isLoading] = useFollowOrUnfollowUserMutation(); // Use the hook to get the mutation function

    // Ensure foundPost is defined before accessing its properties
    if (!foundPost) {
        return <div>Post not found</div>;
    }

    // Get the count of comments and likes
    const comments = foundPost.comments.length;
    const likes = foundPost.likes.length;

    // Handle follow or unfollow user
    const handleFollowOrUnfollow = async () => {
        try {
            const res = await followOrUnfollowUser(foundPost?.author?._id).unwrap();
            if (res.success) {
                const updatedAuthorFollowers = isCurrentlyFollowing
                    ? foundPost.author.followers.filter((followerId) => followerId !== user._id)
                    : [...foundPost.author.followers, user._id];

                const updatedPosts = posts.map((postItem) =>
                    postItem._id === foundPost._id
                        ? { ...postItem, author: { ...postItem.author, followers: updatedAuthorFollowers } }
                        : postItem
                );

                dispatch(setPosts(updatedPosts));
                toast.success(res.message);
            } else {
                toast.error('Failed to follow/unfollow user.');
            }
        } catch (error) {
            console.error('Error following/unfollowing user:', error);
            toast.error(error.data?.message || 'An unexpected error occurred.');
        }
    };

    return (
        <div className='ml-[16%]  mt-1'>
            <Link to='/explore'><ArrowLeft size={50} /></Link>
            <div className=' h-screen flex  justify-center'>
                <div className='grid grid-cols-2 w-[60vw] h-[80vh] shadow-2xl border-blue-950 border-4 rounded-3xl overflow-hidden'>
                    <div className='bg-black w-full h-full'>
                        <img
                            className='w-full h-full object-cover'
                            src={`http://localhost:8000/${foundPost.image}`}
                            alt={foundPost.content}
                        />
                    </div>
                    <div className='w-full h-full p-4'>
                        <div className='flex gap-5 items-center border-b-2 pb-2'>
                            <div className='w-12 h-12'>
                                <Avatar>
                                    <AvatarImage
                                        src={`http://localhost:8000/${foundPost?.author?.profilePicture}`}
                                        className='w-full h-full object-cover rounded-full'
                                    />
                                    <AvatarImage>CN</AvatarImage>
                                </Avatar>
                            </div>
                            <div className='flex gap-5'>
                                <span>{`@${foundPost?.author?.username}`}</span>
                                <Button
                                    onClick={handleFollowOrUnfollow}
                                    className={`font-bold h-7 ${isCurrentlyFollowing ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'}`}
                                    // disabled={isLoading}
                                     // Disable button while loading
                                >
                                    {isCurrentlyFollowing ? 'Unfollow' : 'Follow'}
                                </Button>
                            </div>
                        </div>
                        <div>
                            {foundPost?.comments?.map((item, index) => (
                                <div key={index} className='flex p-2 items-center'>
                                    <div className='w-12 h-12'>
                                        <Avatar>
                                            <AvatarImage
                                                src={`http://localhost:8000/${item?.author?.profilePicture}`}
                                                className='w-full h-full object-cover rounded-full'
                                            />
                                            <AvatarImage>CN</AvatarImage>
                                        </Avatar>
                                    </div>
                                    <div className='flex flex-col flex-grow'>
                                        <p>{item.text}</p>
                                        <div className='flex items-center gap-5'>
                                            <span>{likes} Likes</span>
                                            <span>{comments} Comments</span>
                                            <span>Reply</span>
                                        </div>
                                    </div>
                                    <div className='flex items-center ml-auto'>
                                        <FaRegHeart />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExploreDetails;
