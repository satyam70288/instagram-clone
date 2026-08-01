import { useExplorePostQuery } from '@/services/api';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { resolveMediaUrl } from '@/lib/media';
import { toast } from 'sonner';

const Explore = () => {
  const { guest, posts: guestPosts } = useSelector(store => store.auth)
  const { menu } = useSelector(store => store.menu)
  const navigate = useNavigate();
  const { data, isLoading, isError } = useExplorePostQuery(undefined, {
    skip: Boolean(guest),
    refetchOnMountOrArgChange: true,
  });

  const posts = guest ? (guestPosts || []) : (data?.posts || []);

  const isVideo = (url) => url?.endsWith('.mp4') || url?.endsWith('.mov') || url?.endsWith('.avi');
  const isPdf = (fileName) => fileName?.toLowerCase().endsWith('.pdf');

  if (!guest && isLoading) {
    return <div className='flex min-h-screen items-center justify-center'>Loading explore...</div>;
  }

  if (!guest && isError) {
    return <div className='flex min-h-screen items-center justify-center text-red-500'>Failed to load explore posts.</div>;
  }

  return (
    <div
      className={`
    transition-all duration-500 min-h-screen overflow-y-auto bg-[#f7f7fb] p-2
    ${menu ?
          'ml-0 lg:ml-[6%] lg:w-[calc(100%-6%)]'
          :
          'ml-0 lg:ml-[16%] lg:w-[calc(100%-16%)]'
        }
  `}
    >
      {guest && (
        <div className='mx-auto mb-4 max-w-4xl rounded-xl border border-violet-100 bg-white px-4 py-3 text-sm text-slate-600'>
          Guest preview of Explore. <button className='font-semibold text-violet-600' onClick={() => { toast.info('Create an account for the full feed.'); navigate('/login'); }}>Log in</button> for live posts.
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {posts.map((item) => (
          <Link
            key={item._id}
            to={`/post/${item._id}`}
            className="relative block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-transform hover:scale-[1.02]"
          >
            {isVideo(item?.image) ? (
              <video
                className='w-full aspect-square object-cover'
                muted
                src={resolveMediaUrl(item?.image)}
              />
            ) : isPdf(item?.image) ? (
              <embed
                className='w-full aspect-square'
                src={resolveMediaUrl(item?.image)}
                type="application/pdf"
              />
            ) : (
              <img
                className='w-full aspect-square object-cover'
                src={resolveMediaUrl(item?.image)}
                alt="post"
              />
            )}
          </Link>
        ))}
        {!posts.length && (
          <p className='col-span-full text-center text-slate-400 py-20'>No posts to explore yet.</p>
        )}
      </div>
    </div>
  );
};

export default Explore;
