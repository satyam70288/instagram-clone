import { useState } from 'react';
import { Camera, Heart, Home, LogIn, LogOut, MessageCircle, PlusSquare, Search, SquarePlay, TrendingUp } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import CreatePost from './CreatePost';
import { Popover, PopoverContent } from './ui/popover';
import { PopoverTrigger } from '@radix-ui/react-popover';
import { Menu } from 'lucide-react';
import { Button } from './ui/button';
import { removeAuthUser } from '@/redux/authSlice';
import { setPosts, setSelectedPost } from '@/redux/postSlice';
import SearchPage from './SearchPage';
import { setMenuHadlar } from '@/redux/menuSlice';
import { clearAuthToken } from '@/lib/authStorage';
const LeftSidebar = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [menu, setMenu] = useState(false)
    const [searchActive, setSearchActive] = useState(false); // New state for SearchPage
    const { user, guest } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const { likeNotification } = useSelector(state => state.realTimeNotification);

    const menuHandler = () => {
        setMenu((prevMenu) => !prevMenu);
        dispatch(setMenuHadlar(!menu));
    };
    const logOutHandler = async () => {
        if (guest) {
            dispatch(removeAuthUser());
            dispatch(setSelectedPost(null));
            dispatch(setPosts([]));
            clearAuthToken();
            navigate('/login');
            toast.success('Guest session ended');
            return;
        }
        try {
            const res = await axios.get('/api/v1/user/logout', { withCredentials: true });
            if (res.data.success) {
                dispatch(removeAuthUser());
                dispatch(setSelectedPost(null));
                dispatch(setPosts([]));
                clearAuthToken();
                navigate('/login');
                toast.success(res.data.message);
            }
        } catch (error) {
            // Still clear local session if API fails
            dispatch(removeAuthUser());
            dispatch(setSelectedPost(null));
            dispatch(setPosts([]));
            clearAuthToken();
            navigate('/login');
            toast.error(error.response?.data?.message || 'Logged out locally');
        }
    };

    const sidebarHandler = (textType) => {
        if (textType === 'Log in') {
            logOutHandler();
            return;
        }
        if (guest && ['Create', 'Messages', 'Notifications', 'Profile', 'Search'].includes(textType)) {
            toast.info('Log in or create an account to use this feature.');
            navigate('/login');
            return;
        }
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
            navigate("/notifications");
        }
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
        { icon: guest ? <LogIn /> : <LogOut />, text: guest ? "Log in" : "Logout" },
    ];

    return (
        <div className={`hidden lg:block transition-all duration-300 ${menu ? 'lg:w-[6%]' : 'lg:w-[16%]'} fixed top-0 z-10 left-0 px-3 h-screen border-r border-slate-200 bg-white text-slate-700`}>
            <div className={`my-7 flex items-center ${menu ? 'justify-center' : 'justify-between px-2'}`}>
                <button onClick={() => navigate('/')} className='flex items-center gap-2 text-lg font-bold text-slate-900'>
                    <span className='grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-pink-500 text-white'><Camera size={19}/></span>
                    {!menu && <span>PicShare</span>}
                </button>
                <Menu className={`${menu ? 'absolute -right-3 top-3 rounded-full border bg-white p-1 shadow' : ''} h-5 w-5 cursor-pointer text-slate-400 hover:text-slate-800`} onClick={menuHandler} />
            </div>
            <div className='flex flex-col'>
                <div className=''>
                    {
                        sidebarItems.map((item, index) => (
                            <div onClick={() => sidebarHandler(item.text)} key={index} className={`group relative my-1 flex cursor-pointer items-center gap-4 rounded-xl p-3 transition-colors hover:bg-violet-50 hover:text-violet-700 ${guest && ['Messages', 'Notifications', 'Create', 'Profile'].includes(item.text) ? 'opacity-45' : ''}`} >
                                <span className={`${menu ? 'text-2xl' : 'block text-xl'}`}>{item.icon}</span>
                                <span className={`${menu ? 'hidden' : 'block'} text-sm font-medium`}>{item.text}</span>
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
