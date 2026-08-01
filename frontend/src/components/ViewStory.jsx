import { Dialog } from '@radix-ui/react-dialog';
import { DialogContent, DialogHeader } from './ui/dialog';
import { resolveMediaUrl } from '@/lib/media';

const ViewStory = ({ open, setOpen, story }) => {
  if (!story) return null;

  return (
    <Dialog open={open} >
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="p-4 rounded-md bg-white shadow-lg max-w-lg mx-auto"
      >
        <DialogHeader className="text-center font-semibold">
          {story?.username ? `${story.username}'s story` : 'View Story'}
        </DialogHeader>
        <div className="flex flex-col items-center">
          <img
            src={resolveMediaUrl(story?.media)}
            alt="Story"
            className='w-full max-h-[70vh] object-cover rounded-md'
          />
          {story?.caption && <p className="mt-2 text-center text-sm">{story.caption}</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewStory;
