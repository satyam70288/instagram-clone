import React from 'react';
import { Dialog } from '@radix-ui/react-dialog';
import { DialogContent, DialogHeader } from './ui/dialog';

const ViewStory = ({ open, setOpen, story }) => {
  if (!story) return null;

  return (
    <Dialog open={open} >
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="p-4 rounded-md bg-white shadow-lg max-w-lg mx-auto"
      >
        <DialogHeader className="text-center font-semibold">View Story</DialogHeader>
        <div className="flex flex-col items-center">
          <img
            src={`https://instagram-clone-8h2b.onrender.com/${story?.media}`}
            alt="Story"
            className='w-full h-full object-cover rounded-md'
          />
          <p className="mt-2 text-center text-sm">{story?.caption}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewStory;
