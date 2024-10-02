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
import { Loader, Loader2 } from 'lucide-react';

const CreateStory = ({ open, setOpen, user }) => {
    const imageRef = useRef();
    const dispatch = useDispatch();
    const [file, setFile] = useState(null);
    const [caption, setCaption] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const { stories } = useSelector((state) => state.story);
    const [loading, setLoading] = useState(false);
    const [fileError, setFileError] = useState(''); // State to manage file error messages

    const navigate = useNavigate()
    const allowedTypes = ['image/jpeg', 'image/gif', 'application/pdf', 'video/mp4'];

    // File change handler
    const fileChangeHandler = (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            if (allowedTypes.includes(selectedFile.type)) {
                setFileError(''); // Clear any previous errors
                setFile(selectedFile);

                // Preview the selected image or video
                const reader = new FileReader();
                reader.onloadend = () => setImagePreview(reader.result);
                reader.readAsDataURL(selectedFile);
            } else {
                // Set error message and reset the input field
                setFileError('Only JPG, GIF, MP4, and PDF files are allowed.');
                setFile(null); // Clear file state
                setImagePreview(null); // Clear preview
                e.target.value = null; // Reset input value
                toast.error('Only JPG, GIF, MP4, and PDF files are allowed.');
            }
        }
    };


    const createPostHandler = async () => {
        const formData = new FormData();
        formData.append("caption", caption);
        if (file) formData.append("post", file);

        try {
            setLoading(true)
            // Send the POST request with the form data
            const res = await axios.post('/api/v1/story/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });

            // Handle the success response
            if (res.data.success) {
                dispatch(setStories([res.data.savedStory, ...stories])); // Update state
                setOpen(false); // Close any modal if open
                setLoading(false);
                toast.success(res.data.message); // Show success notification
            } else {
                toast.error('Failed to create story.'); // Show generic error message
            }
        } catch (error) {
            // Check if the error has a response object (i.e., if it's a server response error)
            if (error.response) {
                console.log(error)
                switch (error.response.status) {
                    case 400:
                        toast.error(error.response.data.message || 'Bad Request: Please check your inputs.');
                        break;
                    case 401:
                        toast.error('Unauthorized: Please login to continue.');
                        break;
                    case 500:
                        toast.error(error.message || 'Server Error: Something went wrong on our end nho samajh aaya.');
                        break;
                    default:
                        toast.error(error.response.data.message || 'An unexpected error occurred.');
                }
            } else {
                // Handle network errors or other unexpected errors
                console.error('Error creating story:', error);
                toast.error('An unexpected error occurred. Please try again.');
            }
        } finally {
            setLoading(false)
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
                    {fileError && (
                        <div className="text-red-600 text-sm mb-4">
                            {fileError}
                        </div>
                    )}

                    {
                        imagePreview && (
                            loading ? (<Button>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            </Button>) :
                                (<div className="flex-1">
                                    <Button onClick={createPostHandler}>Create Story</Button>
                                </div>
                                )
                        )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CreateStory;
