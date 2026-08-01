import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'
import { useDispatch, useSelector } from 'react-redux'
import Comment from './Comment'
import axios from 'axios'
import { toast } from 'sonner'
import { setPosts } from '@/redux/postSlice'
import { resolveMediaUrl } from '@/lib/media'

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState("");
  const { selectedPost, posts } = useSelector(store => store.post);
  const { guest } = useSelector(store => store.auth);
  const [comment, setComment] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost.comments || []);
    }
  }, [selectedPost]);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() ? inputText : "");
  }

  const sendMessageHandler = async () => {
    if (guest) {
      toast.info('Log in to comment on posts.');
      return;
    }
    if (!text.trim()) return;

    try {
      const res = await axios.post(`/api/v1/post/${selectedPost?._id}/comment`, { text }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });

      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map(p =>
          p._id === selectedPost._id ? { ...p, comments: updatedCommentData } : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add comment');
    }
  }

  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)} className="max-w-3xl p-0 flex flex-col">
        <div className='flex flex-1'>
          <div className='w-1/2'>
            <img
                src={resolveMediaUrl(selectedPost?.image)}
                alt="post_img"
              className='w-full h-full object-cover rounded-l-lg'
            />
          </div>
          <div className='w-1/2 flex flex-col justify-between'>
            <div className='flex items-center justify-between p-4'>
              <div className='flex gap-3 items-center'>
                <Link to={`/profile/${selectedPost?.author?._id}`}>
                  <Avatar>
                    <AvatarImage src={resolveMediaUrl(selectedPost?.author?.profilePicture)} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link to={`/profile/${selectedPost?.author?._id}`} className='font-semibold text-xs'>{selectedPost?.author?.username}</Link>
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className='cursor-pointer' />
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center text-sm text-center">
                  <div className='cursor-pointer w-full text-[#ED4956] font-bold' onClick={() => toast.info('Use Follow from the post menu.')}>
                    Unfollow
                  </div>
                  <div className='cursor-pointer w-full' onClick={() => toast.info('Favorites coming soon.')}>
                    Add to favorites
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <hr />
            <div className='flex-1 overflow-y-auto max-h-96 p-4'>
              {
                (comment || []).map((item, index) => <Comment key={item._id || index} comment={item} />)
              }
            </div>
            <div className='p-4'>
              <div className='flex items-center gap-2'>
                <input
                  type="text"
                  value={text}
                  onChange={changeEventHandler}
                  onClick={() => guest && toast.info('Log in to comment on posts.')}
                  readOnly={guest}
                  placeholder={guest ? 'Log in to comment...' : 'Add a comment...'}
                  className='w-full outline-none border text-sm border-gray-300 p-2 rounded'
                />
                <Button disabled={guest || !text} onClick={sendMessageHandler} variant="outline">Send</Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CommentDialog
