import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import useGetAllMessage from '@/hooks/useGetAllMessage'
import { useSelector } from 'react-redux'
import useGetRTM from '@/hooks/useGetRTM'


const Messages = ({ selectedUser }) => {
    useGetRTM()
    useGetAllMessage(selectedUser?._id)
    const {messages}=useSelector((state)=>state.chat)
    const {user}=useSelector((state)=>state.auth)
    return (
        <div className='overflow-y-auto flex-1 p-4 bg-slate-400'>
            <div className='flex justify-center'>
                <div className='flex flex-col items-center'>
                    <Avatar>
                        <AvatarImage src={selectedUser?.profilePicture} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <span>{selectedUser?.username}</span>
                    <Link to={`profile/${selectedUser?._id}`}><Button className='h-8 my-2 rounded-md' variant='secondary'>View Profile</Button></Link>
                </div>

            </div>
      <div className="flex flex-col gap-3">
        {messages?.map((Msg) => (
          <div
            key={Msg._id}
            className={`flex ${Msg.senderId === user?._id ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs w-fit break-words rounded-lg p-2 ${Msg.senderId === user?._id ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
              {Msg.message}
            </div>
          </div>
        ))}
      </div>
    </div>

    )
}

export default Messages