import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { toast } from 'sonner';
import axios from 'axios';
import { setSuggestedUsers } from '@/redux/authSlice';
import { resolveMediaUrl } from '@/lib/media';

const SuggestedUsers = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { suggestedUsers, user, guest } = useSelector(store => store.auth);

    const followOrUnfollowHandler = async (id) => {
        if (guest) {
            toast.info("Log in to follow people.");
            navigate('/login');
            return;
        }

        try {
            const res = await axios.post(`/api/v1/user/followorunfollow/${id}`, {}, {
                withCredentials: true
            });

            if (res.data.success) {
                const updatedSuggestedUsers = suggestedUsers.map(userData =>
                  userData._id === id
                    ? {
                        ...userData,
                        followers: (userData.followers || []).includes(user?._id || "")
                          ? userData.followers.filter(followerId => followerId !== user?._id)
                          : [...(userData.followers || []), user?._id]
                      }
                    : userData
                );
                dispatch(setSuggestedUsers(updatedSuggestedUsers));
                toast.success(res.data.message);
            } else {
                toast.error('Failed to follow/unfollow user.');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'An unexpected error occurred.');
        }
    };

    return (
        <div className='my-5 w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'>
            <div className='flex items-center justify-between text-sm gap-7'>
                <h1 className='font-semibold text-slate-800'>Suggested for you</h1>
                <span className='text-xs font-medium text-violet-600'>Discover</span>
            </div>
            {
                suggestedUsers.length === 0 ? (
                    <p className='text-sm text-slate-400 mt-4'>No suggested users</p>
                ) : (
                    suggestedUsers?.map((userData) => {
                        if (!userData) return null;
                        const isFollowing = (userData.followers || []).includes(user?._id);
                        return (
                            <div key={userData?._id} className='my-5 flex items-center justify-between gap-2'>
                                <div className='flex min-w-0 items-center gap-2'>
                                    <Link to={guest ? '/login' : `/profile/${userData?._id}`}>
                                        <Avatar>
                                            <AvatarImage src={resolveMediaUrl(userData?.profilePicture)} alt="profile_picture" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                    </Link>
                                    <div>
                                        <h1 className='truncate text-sm font-semibold text-slate-800'>
                                            <Link to={guest ? '/login' : `/profile/${userData?._id}`}>{userData?.username}</Link>
                                        </h1>
                                        <span className='line-clamp-1 text-xs text-slate-500'>{userData?.bio || 'New to PicShare'}</span>
                                    </div>
                                </div>
                                <span
                                    className={`${isFollowing ? "text-red-500" : "text-violet-600"} shrink-0 cursor-pointer text-xs font-bold hover:text-violet-800`}
                                    onClick={() => followOrUnfollowHandler(userData?._id)}
                                >
                                    {guest ? 'Log in' : isFollowing ? 'Unfollow' : 'Follow'}
                                </span>
                            </div>
                        );
                    })
                )
            }
        </div>
    );
};

export default SuggestedUsers;
