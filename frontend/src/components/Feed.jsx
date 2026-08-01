import Posts from './Posts';
import Stories from './Stories';

const Feed = () => {
  return (
<main className='flex min-w-0 flex-1 flex-col items-center bg-[#f7f7fb] px-3 py-5 sm:px-6'>
  <div className='w-full max-w-xl'>
  <Stories />
  <Posts />
  </div>
</main>

  );
};

export default Feed;
