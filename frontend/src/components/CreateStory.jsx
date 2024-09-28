import { Dialog } from '@radix-ui/react-dialog';
import React, { useRef, useState } from 'react';
import { DialogContent, DialogHeader } from './ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { readFileAsDataURL } from '@/lib/utils';
import axios from 'axios';
import { setStories } from '@/redux/storySlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CreateStory = ({ open, setOpen, user }) => {
    const imageRef = useRef();
    const dispatch = useDispatch();
    const [file, setFile] = useState(null);
    const [caption, setCaption] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const { stories } = useSelector((state) => state.story);
    const navigate = useNavigate()
    const fileChangeHandler = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
            const dataUrl = await readFileAsDataURL(file);
            setImagePreview(dataUrl);
        }
    };

    const createPostHandler = async () => {
        const formData = new FormData();
        formData.append("caption", caption);
        if (file) formData.append("post", file);

        try {
            const res = await axios.post('https://instagram-clone-8h2b.onrender.com/v1/story/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });

            if (res.data.success) {
                dispatch(setStories([res.data.savedStory, ...stories])); // Update state
                toast.success(res.data.message);
                navigate('/');
            } else {
                toast.error('Failed to create story.');
            }
        } catch (error) {
            console.error('Error creating story:', error); // Log errors
            toast.error(error.response?.data?.message || 'An unexpected error occurred.');
        }
    };


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                onInteractOutside={() => setOpen(false)}
                className="p-4 rounded-md bg-white shadow-lg"
            >
                <DialogHeader className="text-center font-semibold">Create New Post</DialogHeader>
                <div className="flex gap-3 items-center flex-col">
                    <Avatar>
                        <AvatarImage src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80" alt="User profile picture" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <input ref={imageRef} type="file" className='hidden' onChange={fileChangeHandler} />
                    <input type="text" placeholder="Caption" className='w-full border p-2 rounded-md outline-none border-none' onChange={(e) => setCaption(e.target.value)} />
                    <Button onClick={() => imageRef.current.click()}>Select from Computer</Button>
                    {
                        imagePreview && (
                            <div className='w-full h-64 flex items-center justify-center'>
                                <img src={imagePreview} alt="preview_img" className='object-cover h-full w-full rounded-md' />
                            </div>
                        )
                    }

                    <div className="flex-1">
                        <Button onClick={createPostHandler}>Create Story</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CreateStory;
