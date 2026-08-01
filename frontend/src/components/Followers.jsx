import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from './ui/button'
import { useFollowOrUnfollowUserMutation, useGetFollowingOrFollowerQuery } from '@/services/api'
import { resolveMediaUrl } from '@/lib/media'
import { useSelector } from 'react-redux'

const Followers = () => {
    const [follower, setFollower] = useState([])
    const params = useParams();
    const userId = params.id;
    const navigate = useNavigate();
    const { user, guest } = useSelector((store) => store.auth);
    const isOwnProfile = user?._id === userId;
    const { data, error, isSuccess } = useGetFollowingOrFollowerQuery(userId, { skip: Boolean(guest) });
    const [followOrUnfollowUser] = useFollowOrUnfollowUserMutation();

    useEffect(() => {
        if (isSuccess) {
          setFollower(data.followers || []);
        } else if (error) {
          toast.error('Failed to load followers');
        }
      }, [isSuccess, data, error]);

    const handleRemove = async (followerId) => {
        if (!isOwnProfile) {
            navigate(`/profile/${followerId}`);
            return;
        }
        try {
            const res = await followOrUnfollowUser(followerId).unwrap();
            toast.success(res.message || 'Updated');
            setFollower((prev) => prev.filter((item) => item._id !== followerId));
        } catch (err) {
            toast.error(err?.data?.message || 'Could not update follower');
        }
    };

    if (guest) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Button onClick={() => navigate('/login')}>Log in to view followers</Button>
            </div>
        );
    }

    return (
        <div className="ml-0 lg:ml-[16%] w-full lg:w-[calc(100%-16%)] min-h-screen flex justify-center items-center bg-slate-900/70 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-md w-full p-4 shadow-xl">
                <div className="flex flex-col">
                    <div className="w-full border-b border-slate-100 p-2">
                        <span className="block text-center font-semibold text-slate-800">Followers</span>
                    </div>
                    <div className="mt-4 max-h-[60vh] overflow-y-auto">
                    {follower.map((item) => (
                            <div key={item._id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg">
                                <Link to={`/profile/${item._id}`} className="flex items-center gap-3">
                                    <img src={resolveMediaUrl(item.profilePicture)} alt={item.username} className="h-10 w-10 rounded-full object-cover" />
                                    <span className="text-slate-800 font-medium">{item.username}</span>
                                </Link>
                                <Button
                                  variant="secondary"
                                  className="h-8"
                                  onClick={() => isOwnProfile ? handleRemove(item._id) : navigate(`/profile/${item._id}`)}
                                >
                                  {isOwnProfile ? 'Remove' : 'View'}
                                </Button>
                            </div>
                        ))}
                        {!follower.length && <p className='text-center text-slate-400 py-8'>No followers yet</p>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Followers
