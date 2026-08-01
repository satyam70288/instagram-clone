import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import SuggestedUsers from './SuggestedUsers';
import { resolveMediaUrl } from '@/lib/media';

const RightSidebar = () => {
  const { user, guest } = useSelector(store => store.auth);
  const profileLink = guest ? '/login' : `/profile/${user?._id}`;
  return (
    <aside className='sticky top-0 hidden h-screen w-[31%] max-w-sm shrink-0 overflow-y-auto px-6 py-8 xl:block'>
      <div className='flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'>
        <Link to={profileLink}>
          <Avatar>
            <AvatarImage src={resolveMediaUrl(user?.profilePicture)} alt="post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <h1 className='text-sm font-semibold text-slate-800'><Link to={profileLink}>{user?.username}</Link></h1>
          <span className='line-clamp-1 text-xs text-slate-500'>{user?.bio || 'Share your world.'}</span>
        </div>
      </div>
      <SuggestedUsers/>
    </aside>
  )
}

export default RightSidebar
