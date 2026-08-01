import { useState } from 'react';
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
import { resolveMediaUrl } from '@/lib/media';

const PostData = ({ post }) => {
    const [text, setText] = useState("");
    const [open, setOpen] = useState(false);
    const { user, guest } = useSelector(store => store.auth);
    const { posts } = useSelector(store => store.post);
    // Set default values if user is not logged in
    const [liked, setLiked] = useState(Boolean(post?.likes?.includes(user?._id)));
    const [postLike, setPostLike] = useState(post?.likes?.length || 0);
    const [comment, setComment] = useState(post?.comments || []);
    const dispatch = useDispatch();
    const isFollowing = Boolean(post?.author?.followers?.includes(user?._id));
    const requireAccount = () => {
        toast.info('Create an account or log in to interact with posts.');
    };
    const isVideo = (url) => {
        // Check if URL ends with common video file extensions
        return url?.endsWith('.mp4') || url?.endsWith('.mov') || url?.endsWith('.avi');
    };
    const isPdf = (fileName) => {
        return fileName?.toLowerCase().endsWith('.pdf');
    };

    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        setText(inputText.trim() || "");
    };

    const likeOrDislikeHandler = async () => {
        if (guest) return requireAccount();
        try {
            const action = liked ? 'dislike' : 'like';
            const res = await axios.get(`/api/v1/post/${post?._id}/${action}`, { withCredentials: true });

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
        if (guest) return requireAccount();
        try {
            const res = await axios.post(`/api/v1/post/${post?._id}/comment`, { text }, {
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
        const token = localStorage.getItem("authToken");
        console.log(token);

        try {
            const res = await axios.delete(`/api/v1/post/delete/${post?._id}`, {
                withCredentials: true,
                headers: {
                    // Authorization: `Bearer ${token}`, // Include the token in the Authorization header
                },
            });

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
        if (guest) return requireAccount();
        try {
            const res = await axios.get(`/api/v1/post/${post?._id}/bookmark`, {
                withCredentials: true,
            });
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error('Error bookmarking post:', error);
        }
    };

    const followOrUnfollowHandler = async (id) => {
        if (guest) return requireAccount();
        try {
            const res = await axios.post(`/api/v1/user/followorunfollow/${id}`, {}, {
                withCredentials: true,
                headers: {
                    // Authorization: `Bearer ${token}`, // Include the token in the Authorization header
                }
            });

            if (res.data.success) {
                const isCurrentlyFollowing = post?.author?.followers.includes(user?._id);
                const updatedAuthorFollowers = isCurrentlyFollowing
                    ? post.author.followers.filter(followerId => followerId !== user?._id)
                    : [...(post?.author?.followers || []), user?._id];

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
        <article className='w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md'>
            {/* Post Header and Avatar */}
            <div className='flex items-center justify-between px-4 py-3.5'>
                <div className='flex items-center gap-2'>
                    <Avatar>
                        <AvatarImage
                            src={resolveMediaUrl(post?.author?.profilePicture)}
                        />

                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className='flex items-center gap-3'>
                        <h1 className='text-sm font-semibold text-slate-800'>{post?.author?.username}</h1>
                        {user?._id === post?.author?._id && <Badge variant="secondary">Author</Badge>}
                    </div>
                </div>
                {/* Post Options */}
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
                        <Button variant='ghost' className="cursor-pointer w-fit" onClick={() => toast.info('Favorites coming soon.')}>Add to favorites</Button>
                        {user && user?._id === post?.author?._id && (
                            <Button onClick={deletePostHandler} variant='ghost' className="cursor-pointer w-fit">Delete</Button>
                        )}
                    </DialogContent>
                </Dialog>
            </div>

            {/* Post Image/Video/PDF */}
            {isVideo(post?.image) ? (
                <video className='w-full aspect-square object-cover bg-slate-100' controls src={resolveMediaUrl(post?.image)} alt="post_video" />
            ) : isPdf(post?.image) ? (
                <embed className='w-full aspect-square' src={resolveMediaUrl(post?.image)} type="application/pdf" width="100%" height="400px" alt="post_pdf" />
            ) : (
                <img
                    className="w-full aspect-square bg-slate-100 object-cover"
                    src={resolveMediaUrl(post?.image)}
                    alt="post_image"
                />
            )}

            {/* Post Likes, Comments, and Action Buttons */}
            <div className='flex items-center justify-between px-4 pt-4'>
                <div className='flex items-center gap-3'>
                    {liked
                        ? <FaHeart onClick={likeOrDislikeHandler} size={'24'} className='cursor-pointer text-red-600' />
                        : <FaRegHeart onClick={likeOrDislikeHandler} size={'22px'} className='cursor-pointer hover:text-gray-600' />
                    }
                    <MessageCircle onClick={() => {
                        if (guest) return requireAccount();
                        dispatch(setSelectedPost(post));
                        setOpen(true);
                    }} className='cursor-pointer hover:text-gray-600' />
                    <Send onClick={guest ? requireAccount : undefined} className='cursor-pointer hover:text-violet-600' />
                </div>
                <Bookmark onClick={bookmarkHandler} className='cursor-pointer hover:text-violet-600' />
            </div>
            <div className='px-4 pb-4 pt-2'>
            <span className='mb-1 block text-sm font-semibold text-slate-800'>{postLike} likes</span>
            <p className='text-sm leading-6 text-slate-700'>
                <span className='font-medium mr-2'>{post?.author?.username}</span>
                {post?.caption}
            </p>
            {comment.length > 0 && (
                <span onClick={() => {
                    if (guest) return requireAccount();
                    dispatch(setSelectedPost(post));
                    setOpen(true);
                }} className='cursor-pointer text-sm text-gray-500 hover:text-gray-700'>
                    View all {comment.length} comments
                </span>
            )}
            <CommentDialogu open={open} setOpen={setOpen} />
            <div className='mt-3 flex items-center justify-between border-t border-slate-100 pt-3'>
                <input
                    type="text"
                    placeholder={guest ? 'Log in to add a comment' : 'Add a comment...'}
                    value={text}
                    onChange={changeEventHandler}
                    onClick={guest ? requireAccount : undefined}
                    readOnly={guest}
                    className='w-full bg-transparent text-sm outline-none placeholder:text-slate-400'
                />
                {text && <span onClick={commentHandler} className='text-[#3BADF8] cursor-pointer font-semibold'>Post</span>}
            </div>
            </div>
        </article>
    );
};

export default PostData;
