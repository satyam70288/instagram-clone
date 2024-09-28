import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import React from 'react'

const Comment = ({ comment }) => {
    console.log(comment)
    return (
        <div className='my-2'>
            <div className='flex items-center gap-2'>
                <Avatar>
                    <AvatarImage src={comment?.author?.profilePic} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className='font-bold text-sm'>{comment?.author?.username}<span className='font-medium pl-1'>{comment.text}</span></h1>
            </div>
        </div>
    )
}

export default Comment