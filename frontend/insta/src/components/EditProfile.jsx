import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import React, { useRef, useState } from 'react'
import { Button } from './ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { setAuthUser } from '@/redux/authSlice'

const EditProfile = () => {
    const { user } = useSelector((state) => state.auth)
    const imageref = useRef()
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState({
        profilePhoto: user?.profilePicture,
        bio: user?.bio,
        gender: user?.gender || 'male'
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) setInput({ ...input, profilePhoto: file });
    }

    const selectChangeHandler = (e) => {
        setInput({ ...input, gender: e.target.value });
    }

    const editProfileHandler = async () => {
        console.log(input);
        const formData = new FormData();
        formData.append("bio", input.bio);
        formData.append("gender", input.gender);
        if (input.profilePhoto) {
            formData.append("profilePhoto", input.profilePhoto);
        }
        try {
            setLoading(true);
            const res = await axios.post('http://localhost:8000/api/v1/user/profile/edit', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                const updatedUserData = {
                    ...user,
                    bio: res.data.user?.bio,
                    profilePicture: res.data.user?.profilePicture,
                    gender: res.data.user.gender
                };
                dispatch(setAuthUser(updatedUserData));
                setInput({
                    profilePhoto: '',
                    bio: '',
                    gender: 'male' // or any default value
                });
                navigate(`/profile/${user?._id}`);
                toast.success(res.data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error.response.data.messasge);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='flex mx-auto  max-w-2xl pl-10 my-8'>
            <section className='flex flex-col gap-6 w-full'>
                <h1 className='font-bold text-xl'> Edit Profile</h1>
                <div className='flex justify-between items-center bg-gray-100 rounded-md p-4'>
                    <div className='flex gap-3 items-center'>
                        <Avatar className='w-16 h-16 rounded-full overflow-hidden'>
                            <AvatarImage
                                src={`http://localhost:8000/${user?.profilePicture.replace(/\/{2,}/g, '/')}`}
                                alt="profile photo"
                                className='object-cover w-full h-full' // Ensures image covers the container
                            />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className='font-bold text-sm leading-none'>{user?.username}</h1>
                            <span className='text-gray-600'>{user?.bio || 'Bio here...'}</span>
                        </div>
                    </div>
                    <input ref={imageref} onChange={fileChangeHandler} type="file" hidden />
                    <Button onClick={() => imageref.current.click()} className='bg-blue-500 h-10 hover:bg-indigo-400'>Change Photo</Button>
                </div>
                <div>
                    <h1> Bio</h1>
                    <Textarea onChange={(e) => setInput({ ...input, bio: e.target.value })} name='bio' value={input.bio} placeholder='Bio' className='focus-visible:ring-transparent' />
                </div>
                <div className=''>
                    <h1 className='font-bold mb-2 '>Gender</h1>
                    <div class="w-full ">
                        <label className="block text-gray-700 text-sm font-bold mb-2" for="gender">
                            Select Gender:
                        </label>
                        <select onChange={selectChangeHandler} value={input.gender} id="gender" name="gender" class="block  w-[50%] bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight  ">
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div className='flex justify-end'>
                        {
                            loading ? (
                                <Button className='w-fit bg-[#0095F6] hover:bg-[#2a8ccd]'>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    Please wait
                                </Button>
                            ) : (
                                <Button onClick={editProfileHandler} className='w-fit bg-[#0095F6] hover:bg-[#2a8ccd]'>Submit</Button>
                            )
                        }
                    </div>
                </div>


            </section>
        </div>
    )
}

export default EditProfile