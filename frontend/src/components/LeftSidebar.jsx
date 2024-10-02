import React, { useState } from 'react';
import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, SquarePlay, TrendingUp } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import CreatePost from './CreatePost';
import { Popover, PopoverContent } from './ui/popover';
import { PopoverTrigger } from '@radix-ui/react-popover';

import { Button } from './ui/button';
import { setAuthUser } from '@/redux/authSlice';
import { setPosts, setSelectedPost } from '@/redux/postSlice';
import SearchPage from './SearchPage';

const LeftSidebar = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [searchActive, setSearchActive] = useState(false); // New state for SearchPage
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const { likeNotification } = useSelector(state => state.realTimeNotification);

    const logOutHandler = async () => {
        try {
            const res = await axios.get('/api/v1/user/logout', { withCredentials: true });
            if (res.data.success) {
                dispatch(setAuthUser(null));
                dispatch(setSelectedPost(null));
                dispatch(setPosts([]));
                navigate('/login');
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error.response);
            toast.error(error.response?.data?.message || 'Logout failed');
        }
    };

    const sidebarHandler = (textType) => {
        if (textType === 'Logout') {
            logOutHandler();
        } else if (textType === "Create") {
            setOpen(true);
        } else if (textType === "Profile") {
            navigate(`/profile/${user?._id}`);
        } else if (textType === "Home") {
            navigate("/");
        } else if (textType === 'Messages') {
            navigate("/chat");
        } else if (textType === 'Reels') {
            navigate("/reels");
        } else if (textType === 'Explore') {
            navigate("/explore");
        } 
        else if (textType === 'Search') {
            setSearchActive(true); // Activate the search page when "Search" is clicked
        }
        else if (textType === 'Notifications') {
            navigate("/notifications");}
    };

    const sidebarItems = [
        { icon: <Home />, text: "Home" },
        { icon: <Search />, text: "Search" }, // Search page
        { icon: <TrendingUp />, text: "Explore" },
        { icon: <MessageCircle />, text: "Messages" },
        { icon: <Heart />, text: "Notifications" },
        { icon: <PlusSquare />, text: "Create" },
        { icon: <SquarePlay />, text: "Reels" },
        {
            icon: (
                <Avatar className='w-6 h-6'>
                    <AvatarImage src={user?.profilePicture} alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            ),
            text: "Profile"
        },
        { icon: <LogOut />, text: "Logout" },
    ];

    return (
        <div className="hidden md:w-[17%] lg:block md:fixed top-0 z-10 left-0 px-4 w-[16%] h-screen border-r border-gray-300 bg-[#1C1C1C] text-white">
            <div className='flex flex-col '>
                <h1 className='my-8 font-bold text-xl'>LOGO</h1>
                <div className=''>
                    {
                        sidebarItems.map((item, index) => (
                            <div onClick={() => sidebarHandler(item.text)} key={index} className='flex items-center gap-4 relative hover:bg-red-400 cursor-pointer rounded-lg p-3 my-3' >
                                {item.icon}
                                <span>{item.text}</span>
                                {
                                    item.text === 'Notifications' && likeNotification?.length > 0 && (
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <div>
                                                    <Button size='icon' className="rounded-full h-5 w-5 absolute bottom-6 left-6">{likeNotification?.length}</Button>
                                                </div>
                                            </PopoverTrigger>
                                            <PopoverContent>
                                                <div>
                                                    {
                                                        likeNotification.length === 0 ? (<p>No new notification</p>) : (
                                                            likeNotification.map((notification) => {
                                                                return (
                                                                    <div key={notification.userId} className='flex items-center gap-2 my-2'>
                                                                        <Avatar>
                                                                            <AvatarImage src={notification.userDetails?.profilePicture} />
                                                                            <AvatarFallback>CN</AvatarFallback>
                                                                        </Avatar>
                                                                        <p className='text-sm'><span className='font-bold'>{notification.userDetails?.username}</span> liked your post</p>
                                                                    </div>
                                                                );
                                                            })
                                                        )
                                                    }
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    )
                                }
                            </div>
                        ))
                    }
                </div>
            </div>

            {/* Conditionally render SearchPage if search is active */}
            {searchActive && <SearchPage searchActive={searchActive} setSearchActive={setSearchActive} />}

            <CreatePost open={open} setOpen={setOpen} />
        </div>
    );
};

export default LeftSidebar;
