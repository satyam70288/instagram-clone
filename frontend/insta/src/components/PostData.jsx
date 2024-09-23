import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react';
import { Button } from './ui/button';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { setPosts, setSelectedPost } from '@/redux/postSlice';
import { Badge } from './ui/badge';
import CommentDialogu from './CommentDialogu';

const PostData = ({ post }) => {
    const [text, setText] = useState("");
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);
    const { posts } = useSelector(store => store.post);
    const [liked, setLiked] = useState(post?.likes.includes(user?._id) || false);
    const [postLike, setPostLike] = useState(post?.likes.length || 0);
    const [comment, setComment] = useState(post?.comments || []);
    const dispatch = useDispatch();

    const isFollowing = post?.author?.followers.includes(user?._id);
    const isVideo = (url) => {
        // Check if URL ends with common video file extensions
        return url.endsWith('.mp4') || url.endsWith('.mov') || url.endsWith('.avi');
    };

    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        setText(inputText.trim() || "");
    };

    const likeOrDislikeHandler = async () => {
        try {
            const action = liked ? 'dislike' : 'like';
            const res = await axios.get(`http://localhost:8000/api/v1/post/${post?._id}/${action}`, { withCredentials: true });

            if (res.data.success) {
                const updatedLikes = liked ? postLike - 1 : postLike + 1;
                setPostLike(updatedLikes);
                setLiked(!liked);

                const updatedPostData = posts.map(p =>
                    p._id === post?._id
                        ? { ...p, likes: liked ? p.likes.filter(id => id !== user?._id) : [...p.likes, user?._id] }
                        : p
                );
                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error('Error liking/disliking post:', error);
        }
    };

    const commentHandler = async () => {
        try {
            const res = await axios.post(`http://localhost:8000/api/v1/post/${post?._id}/comment`, { text }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });

            if (res.data.success) {
                const updatedCommentData = [...comment, res.data.comment];
                setComment(updatedCommentData);

                const updatedPostData = posts.map(p =>
                    p._id === post?._id ? { ...p, comments: updatedCommentData } : p
                );
                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
                setText("");
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const deletePostHandler = async () => {
        try {
            const res = await axios.delete(`http://localhost:8000/api/v1/post/delete/${post?._id}`, { withCredentials: true });

            if (res.data.success) {
                const updatedPostData = posts.filter(postItem => postItem._id !== post?._id);
                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            toast.error(error.response?.data?.message || 'An unexpected error occurred.');
        }
    };

    const bookmarkHandler = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/api/v1/post/${post?._id}/bookmark`, { withCredentials: true });
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error('Error bookmarking post:', error);
        }
    };

    const followOrUnfollowHandler = async (id) => {
        try {
            const res = await axios.post(`http://localhost:8000/api/v1/user/followorunfollow/${id}`, {}, { withCredentials: true });

            if (res.data.success) {
                const isCurrentlyFollowing = post?.author?.followers.includes(user?._id);
                const updatedAuthorFollowers = isCurrentlyFollowing
                    ? post.author.followers.filter(followerId => followerId !== user?._id)
                    : [...post?.author?.followers, user?._id];

                const updatedPosts = posts.map(postItem =>
                    postItem._id === post?._id
                        ? { ...postItem, author: { ...postItem.author, followers: updatedAuthorFollowers } }
                        : postItem
                );
                dispatch(setPosts(updatedPosts));
                toast.success(res.data.message);
            } else {
                toast.error('Failed to follow/unfollow user.');
            }
        } catch (error) {
            console.error('Error following/unfollowing user:', error);
            toast.error(error.response?.data?.message || 'An unexpected error occurred.');
        }
    };

    return (
        <div className='ml-[14%] my-8 w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto border p-4 border-gray-300 bg-white rounded-lg shadow-lg'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <Avatar>
                        <AvatarImage src={`http://localhost:8000/${post?.author?.profilePicture.replace(/\\/g, '/')}`} alt="post_image" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className='flex items-center gap-3'>
                        <h1 className='font-semibold text-gray-700'>{post?.author?.username}</h1>
                        {user?._id === post?.author?._id && <Badge variant="secondary">Author</Badge>}
                    </div>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <MoreHorizontal className='cursor-pointer text-gray-600 hover:text-gray-800 transition-colors' />
                    </DialogTrigger>
                    <DialogContent className="flex flex-col items-center text-sm text-center">
                        {post?.author?._id !== user?._id && (
                            <Button variant='ghost' className={`cursor-pointer w-fit ${isFollowing ? 'text-red-600' : 'text-blue-500'} font-bold`} onClick={() => followOrUnfollowHandler(post?.author?._id)}>
                                {isFollowing ? 'Unfollow' : 'Follow'}
                            </Button>
                        )}
                        <Button variant='ghost' className="cursor-pointer w-fit">Add to favorites</Button>
                        {user && user?._id === post?.author?._id && (
                            <Button onClick={deletePostHandler} variant='ghost' className="cursor-pointer w-fit">Delete</Button>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
            {/* <img
                className='rounded-md my-2 w-full aspect-square object-cover'
                src={`http://localhost:8000/${post?.image.replace(/\\/g, '/')}`}
                alt="post_img"
            /> */}
            {isVideo(post?.image) ? (
                <video
                    className='rounded-md my-2 w-full aspect-square object-cover'
                    controls
                    src={`http://localhost:8000/${post?.image.replace(/\\/g, '/')}`}
                    alt="post_video"
                />
            ) : (
                <img
                    className='rounded-md my-2 w-full aspect-square object-cover'
                    src={`http://localhost:8000/${post?.image.replace(/\\/g, '/')}`}
                    alt="post_image"
                />
            )}

            <div className='flex items-center justify-between my-2'>
                <div className='flex items-center gap-3'>
                    {liked
                        ? <FaHeart onClick={likeOrDislikeHandler} size={'24'} className='cursor-pointer text-red-600' />
                        : <FaRegHeart onClick={likeOrDislikeHandler} size={'22px'} className='cursor-pointer hover:text-gray-600' />
                    }
                    <MessageCircle onClick={() => {
                        dispatch(setSelectedPost(post));
                        setOpen(true);
                    }} className='cursor-pointer hover:text-gray-600' />
                    <Send className='cursor-pointer hover:text-gray-600' />
                </div>
                <Bookmark onClick={bookmarkHandler} className='cursor-pointer hover:text-gray-600' />
            </div>
            <span className='font-medium block mb-2 text-gray-800'>{postLike} likes</span>
            <p className='text-gray-700'>
                <span className='font-medium mr-2'>{post?.author?.username}</span>
                {post?.caption}
            </p>
            {comment.length > 0 && (
                <span onClick={() => {
                    dispatch(setSelectedPost(post));
                    setOpen(true);
                }} className='cursor-pointer text-sm text-gray-500 hover:text-gray-700'>
                    View all {comment.length} comments
                </span>
            )}
            <CommentDialogu open={open} setOpen={setOpen} />
            <div className='flex items-center justify-between'>
                <input
                    type="text"
                    placeholder='Add a comment...'
                    value={text}
                    onChange={changeEventHandler}
                    className='outline-none text-sm w-full border p-2 rounded-md border-gray-300'
                />
                {text && <span onClick={commentHandler} className='text-[#3BADF8] cursor-pointer font-semibold'>Post</span>}
            </div>
        </div>
    );
};

export default PostData;
