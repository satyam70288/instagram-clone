import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { MessageCircleCode } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { setSelectedUser } from '@/redux/authSlice'
import Messages from './Messages'
import { setMessages } from '@/redux/chatSlice';
import axios from 'axios'
const ChatPage = () => {
    const { user, suggestedUsers,selectedUser } = useSelector((state) => state.auth)
    const {onlineUsers,messages}=useSelector((state)=>state.chat)
    const [textMessage, setTextMessage] = useState("");
    const dispatch=useDispatch()
    const sendMessageHandler = async (receiverId) => {
        try {
            const res = await axios.post(`http://localhost:8000/api/v1/message/send/${receiverId}`, { textMessage }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setMessages([...messages, res.data.newMessage]));
                setTextMessage("");
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        return () => {
            dispatch(setSelectedUser(null));
        }
    },[]);

    return (
        <div className='flex ml-[16%] h-screen scrollbar-hide '
            style={{
                scrollbarWidth: 'none', /* Firefox */
                msOverflowStyle: 'none', /* IE and Edge */
            }}
        >
            <section className='w-full md:w-1/4 sm:w-1/3 border-r-2 '>
                <h1 className='font-bold text-3xl mb-4 px-3 '>{user?.username}</h1>
                <hr className='mb-4 border-gray-300' />
                <div className='overflow-y-auto h-[80vh]' 
                style={{
                    scrollbarWidth: 'none', /* Firefox */
                    msOverflowStyle: 'none', /* IE and Edge */
                }}
                >
                    {
                        suggestedUsers.map((suggestedUser) => {                            
                            const isOnline = onlineUsers.includes(suggestedUser?._id);
                            
                            return (
                                <div onClick={() => dispatch(setSelectedUser(suggestedUser))} className='flex items-center gap-4 p-3 hover:bg-gray-200 cursor-pointer'>
                                    <Avatar >
                                        <AvatarImage className='w-40 h-40' src={suggestedUser?.profilePicture} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <div className='flex flex-col'>
                                        <span className='font-semibold'>
                                            {suggestedUser?.username}
                                        </span>
                                        <span className={`text-xs ${isOnline ? 'text-green-500':'text-red-600'}`}>{isOnline ? 'Online':'Offline'}</span>

                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </section>
            {
                selectedUser ? (
                    <section className=' flex-1 border-l border-l-gray-300 flex flex-col h-full'>
                        <div className='flex gap-3 items-center px-3 py-2 border-gray-300 sticky top-0 bg-green-100 z-10'>
                            <Avatar>
                                <AvatarImage src={selectedUser?.profilePicture} alt='profile' />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div className='flex flex-col '>
                                <span>{selectedUser?.username || 'Username'}</span>
                            </div>
                        </div>
                        <Messages selectedUser={selectedUser} />
                        <div className='flex items-center p-4 border-t border-t-gray-300'>
                            <Input value={textMessage} onChange={(e) => setTextMessage(e.target.value)} type="text" className='flex-1 mr-2 focus-visible:ring-transparent' placeholder="Messages..." />
                            <Button onClick={() => sendMessageHandler(selectedUser?._id)}>Send</Button>

                        </div>
                    </section>
                ) : (
                    <div className=' flex  flex-col  justify-center items-center mx-auto'>
                        <MessageCircleCode className='w-40 h-48' />
                        <h1 className='font-medium'>Your messages</h1>
                        <span>Send a message to start a chat.</span>
                    </div>
                )
            }
        </div>
    )
}

export default ChatPage