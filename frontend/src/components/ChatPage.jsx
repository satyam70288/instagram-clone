import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { MessageCircleCode } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { setSelectedUser } from '@/redux/authSlice'
import Messages from './Messages'
import { setMessages } from '@/redux/chatSlice';
import axios from 'axios'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { resolveMediaUrl } from '@/lib/media'

const ChatPage = () => {
    const { user, suggestedUsers, selectedUser, guest } = useSelector((state) => state.auth)
    const { onlineUsers, messages } = useSelector((state) => state.chat)
    const [textMessage, setTextMessage] = useState("");
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { menu } = useSelector(store => store.menu)

    useEffect(() => {
        if (guest) {
            toast.info('Log in to use messages.');
            navigate('/login');
        }
    }, [guest, navigate]);

    const sendMessageHandler = async (receiverId) => {
        if (!textMessage.trim()) return;
        try {
            const res = await axios.post(`/api/v1/message/send/${receiverId}`, { textMessage }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setMessages([...(messages || []), res.data.newMessage]));
                setTextMessage("");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send message');
        }
    }

    useEffect(() => {
        return () => {
            dispatch(setSelectedUser(null));
        }
    }, [dispatch]);

    return (
        <div className={`flex ${menu ? 'ml-0 lg:ml-[6%]' : 'ml-0 lg:ml-[16%]'} h-screen scrollbar-hide transition-all duration-500 p-5`}>
            <section className='w-full md:w-1/4 sm:w-1/3 border-r border-slate-200'>
                <h1 className='font-bold text-2xl mb-4 px-3'>{user?.username}</h1>
                <hr className='mb-4 border-gray-200' />
                <div className='overflow-y-auto h-[80vh]'>
                    {(suggestedUsers || []).map((suggestedUser) => {
                        const isOnline = onlineUsers?.includes(suggestedUser?._id);
                        return (
                            <div
                                key={suggestedUser._id}
                                onClick={() => dispatch(setSelectedUser(suggestedUser))}
                                className='flex items-center gap-4 p-3 hover:bg-violet-50 cursor-pointer rounded-xl'
                            >
                                <Avatar className='h-12 w-12 overflow-hidden rounded-full'>
                                    <AvatarImage className='h-full w-full object-cover' src={resolveMediaUrl(suggestedUser?.profilePicture)} />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <div className='flex flex-col'>
                                    <span className='font-semibold'>{suggestedUser?.username}</span>
                                    <span className={`text-xs ${isOnline ? 'text-green-500' : 'text-slate-400'}`}>
                                        {isOnline ? 'Online' : 'Offline'}
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>
            {selectedUser ? (
                <section className='flex-1 border-l border-slate-200 flex flex-col h-full'>
                    <div className='flex gap-3 items-center px-3 py-2 border-b border-slate-100 sticky top-0 bg-white z-10'>
                        <Avatar className='h-10 w-10 overflow-hidden rounded-full'>
                            <AvatarImage src={resolveMediaUrl(selectedUser?.profilePicture)} alt='profile' className='h-full w-full object-cover' />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <span className='font-semibold'>{selectedUser?.username || 'Username'}</span>
                    </div>
                    <Messages selectedUser={selectedUser} />
                    <div className='flex items-center p-4 border-t border-slate-100'>
                        <Input
                            value={textMessage}
                            onChange={(e) => setTextMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendMessageHandler(selectedUser?._id)}
                            type="text"
                            className='flex-1 mr-2 focus-visible:ring-transparent'
                            placeholder="Messages..."
                        />
                        <Button onClick={() => sendMessageHandler(selectedUser?._id)}>Send</Button>
                    </div>
                </section>
            ) : (
                <div className='flex flex-col justify-center items-center mx-auto text-slate-500'>
                    <MessageCircleCode className='w-24 h-24 text-violet-300' />
                    <h1 className='font-medium text-slate-800 mt-2'>Your messages</h1>
                    <span>Send a message to start a chat.</span>
                </div>
            )}
        </div>
    )
}

export default ChatPage
