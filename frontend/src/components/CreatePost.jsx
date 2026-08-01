import { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/redux/postSlice';
import { resolveMediaUrl } from '@/lib/media';

const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef();
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState('');
  const { user } = useSelector(store => store.auth);
  const { posts } = useSelector(store => store.post);
  const dispatch = useDispatch();

  const allowedTypes = ['image/jpeg', 'image/gif', 'image/png', 'image/webp', 'application/pdf', 'video/mp4'];

  const readFileAsDataURL = (selected) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(selected);
    });
  };

  const fileChangeHandler = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (allowedTypes.includes(selectedFile.type)) {
      setFileError('');
      setFile(selectedFile);

      if (selectedFile.type.startsWith('image/')) {
        const dataUrl = await readFileAsDataURL(selectedFile);
        setImagePreview(dataUrl);
      } else if (selectedFile.type.startsWith('video/')) {
        setImagePreview(URL.createObjectURL(selectedFile));
      } else if (selectedFile.type === 'application/pdf') {
        setImagePreview(URL.createObjectURL(selectedFile));
      }
    } else {
      setFileError('Only JPG, PNG, WEBP, GIF, MP4, and PDF files are allowed.');
      setFile(null);
      setImagePreview(null);
      e.target.value = null;
      toast.error('Only JPG, PNG, WEBP, GIF, MP4, and PDF files are allowed.');
    }
  };

  const createPostHandler = async () => {
    const formData = new FormData();
    formData.append("caption", caption);
    if (file) formData.append("image", file);

    try {
      setLoading(true);
      const res = await axios.post('/api/v1/post/addpost', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setPosts([res.data.post, ...posts]));
        toast.success(res.data.message);
        setOpen(false);
        setCaption('');
        setFile('');
        setImagePreview('');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Dialog open={open}>
        <DialogContent onInteractOutside={() => setOpen(false)} className=''>
          <DialogHeader className='text-center font-semibold'>Create New Post</DialogHeader>
          <div className='flex gap-3 items-center'>
            <Avatar>
              <AvatarImage src={resolveMediaUrl(user?.profilePicture)} alt="img" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <h1 className='font-semibold text-xs'>{user?.username}</h1>
              <span className='text-gray-600 text-xs'>{user?.bio || 'Share something new'}</span>
            </div>
          </div>
          <Textarea value={caption} onChange={(e) => setCaption(e.target.value)} className="focus-visible:ring-transparent border-none" placeholder="Write a caption..." />
          {imagePreview && file && (
            <div className='w-full h-64 flex items-center justify-center'>
              {file.type?.startsWith('image/') ? (
                <img src={imagePreview} alt="preview" className='object-cover h-full w-full rounded-md' />
              ) : file.type?.startsWith('video/') ? (
                <video src={imagePreview} controls className='h-full w-full rounded-md' />
              ) : file.type === 'application/pdf' ? (
                <embed src={imagePreview} type="application/pdf" width="100%" height="100%" className="h-full w-full rounded-md" />
              ) : (
                <div className="text-red-500">Unsupported file type</div>
              )}
            </div>
          )}
          {fileError && <div className="text-red-600 text-sm mb-4">{fileError}</div>}

          <input ref={imageRef} type='file' className='hidden' onChange={fileChangeHandler} />
          <Button onClick={() => imageRef.current.click()} className='w-fit mx-auto bg-violet-600 hover:bg-violet-700'>Select from computer</Button>
          {imagePreview && (
            loading ? (
              <Button disabled>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Please wait
              </Button>
            ) : (
              <Button onClick={createPostHandler} type="button" className="w-full">Post</Button>
            )
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CreatePost
