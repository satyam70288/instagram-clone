import { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { FaRegHeart } from "react-icons/fa";
import { ArrowLeft } from 'lucide-react';
import { useExplorePostQuery, useFollowOrUnfollowUserMutation } from '@/services/api';
import { toast } from 'sonner';
import { setPosts } from '@/redux/postSlice';
import { resolveMediaUrl } from '@/lib/media';

const ExploreDetails = () => {
    const params = useParams();
    const postId = params.id;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { posts } = useSelector((state) => state.post);
    const { user, guest, posts: guestPosts } = useSelector((state) => state.auth);
    const { data: exploreData } = useExplorePostQuery(undefined, { skip: Boolean(guest) });

    const foundPost = useMemo(() => {
        const explorePosts = exploreData?.posts || [];
        const pool = guest ? (guestPosts || []) : [...(posts || []), ...explorePosts];
        return pool.find((post) => post._id === postId);
    }, [posts, exploreData, guest, guestPosts, postId]);

    const [followOrUnfollowUser] = useFollowOrUnfollowUserMutation();

    if (!foundPost) {
        return (
            <div className='flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f7f7fb] p-6'>
                <p className='text-slate-600'>Post not found</p>
                <Button onClick={() => navigate('/explore')}>Back to Explore</Button>
            </div>
        );
    }

    const isVideo = (url) => url?.endsWith('.mp4') || url?.endsWith('.mov') || url?.endsWith('.avi');
    const isPdf = (fileName) => fileName?.toLowerCase().endsWith('.pdf');
    const isCurrentlyFollowing = Boolean(foundPost?.author?.followers?.includes(user?._id));
    const comments = foundPost?.comments?.length || 0;
    const likes = foundPost?.likes?.length || 0;

    const handleFollowOrUnfollow = async () => {
        if (guest) {
            toast.info('Log in to follow people.');
            navigate('/login');
            return;
        }
        try {
            const res = await followOrUnfollowUser(foundPost?.author?._id).unwrap();
            if (res.success) {
                const updatedAuthorFollowers = isCurrentlyFollowing
                    ? foundPost.author.followers.filter((followerId) => followerId !== user._id)
                    : [...(foundPost.author.followers || []), user._id];

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
            toast.error(error.data?.message || 'An unexpected error occurred.');
        }
    };

    return (
        <div className='min-h-screen bg-[#f7f7fb] p-4 lg:ml-[16%]'>
            <Link to='/explore' className='mb-4 inline-flex items-center gap-2 text-slate-600 hover:text-violet-600'>
                <ArrowLeft size={20} /> Back to Explore
            </Link>
            <div className='mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg md:grid-cols-2'>
                <div className='bg-black'>
                    {isVideo(foundPost?.image) ? (
                        <video className='h-full max-h-[80vh] w-full object-cover' controls src={resolveMediaUrl(foundPost?.image)} />
                    ) : isPdf(foundPost?.image) ? (
                        <embed className='h-[80vh] w-full' src={resolveMediaUrl(foundPost?.image)} type="application/pdf" />
                    ) : (
                        <img className='h-full max-h-[80vh] w-full object-cover' src={resolveMediaUrl(foundPost?.image)} alt="post" />
                    )}
                </div>
                <div className='flex flex-col p-5'>
                    <div className='flex items-center gap-4 border-b border-slate-100 pb-4'>
                        <Avatar>
                            <AvatarImage src={resolveMediaUrl(foundPost?.author?.profilePicture)} />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <span className='font-semibold'>@{foundPost?.author?.username}</span>
                        <Button
                            onClick={handleFollowOrUnfollow}
                            className={`ml-auto h-8 ${isCurrentlyFollowing ? 'bg-slate-200 text-black' : 'bg-violet-600 text-white'}`}
                        >
                            {guest ? 'Log in' : isCurrentlyFollowing ? 'Unfollow' : 'Follow'}
                        </Button>
                    </div>
                    <p className='mt-4 text-sm text-slate-700'>
                        <span className='font-semibold'>{foundPost?.author?.username}</span> {foundPost?.caption}
                    </p>
                    <div className='mt-3 flex gap-4 text-sm text-slate-500'>
                        <span>{likes} likes</span>
                        <span>{comments} comments</span>
                    </div>
                    <div className='mt-4 flex-1 space-y-3 overflow-y-auto'>
                        {(foundPost?.comments || []).map((item, index) => (
                            <div key={item._id || index} className='flex items-start gap-3'>
                                <Avatar className='h-8 w-8'>
                                    <AvatarImage src={resolveMediaUrl(item?.author?.profilePicture)} />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <div className='flex-1'>
                                    <p className='text-sm'><span className='font-semibold'>{item?.author?.username || item?.user}</span> {item.text}</p>
                                </div>
                                <FaRegHeart className='mt-1 text-slate-400' />
                            </div>
                        ))}
                        {!foundPost?.comments?.length && (
                            <p className='text-sm text-slate-400'>No comments yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExploreDetails;
