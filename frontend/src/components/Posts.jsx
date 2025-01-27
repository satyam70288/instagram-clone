import React from 'react';
import PostData from './PostData';
import { useSelector } from 'react-redux';

const Posts = () => {
  const { posts } = useSelector((store) => store.post);

  // Use dummy data if posts are not available
  const post = posts?.length > 0 ? posts : [
    {
      _id: '1',
      author: {
        _id: 'user1',
        username: 'john_doe',
        profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg',
        followers: ['user2', 'user3'],
      },
      caption: 'Had an amazing day at the beach!',
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
      likes: ['user1', 'user3'],
      comments: [
        { user: 'user2', text: 'Looks awesome!' },
        { user: 'user3', text: 'Wish I was there!' },
      ],
    },
    {
      _id: '2',
      author: {
        _id: 'user2',
        username: 'jane_doe',
        profilePicture: 'https://randomuser.me/api/portraits/women/2.jpg',
        followers: ['user1', 'user3'],
      },
      caption: 'Just finished a great book!',
      image: 'https://randomuser.me/api/portraits/women/2.jpg',
      likes: ['user2', 'user1'],
      comments: [
        { user: 'user1', text: 'I loved that book!' },
        { user: 'user3', text: 'Gotta check it out!' },
      ],
    },
    {
      _id: '3',
      author: {
        _id: 'user3',
        username: 'mark_smith',
        profilePicture: 'https://randomuser.me/api/portraits/men/3.jpg',
        followers: ['user1', 'user2'],
      },
      caption: 'At the gym, getting stronger!',
      image: 'https://randomuser.me/api/portraits/men/3.jpg',
      likes: ['user1', 'user2'],
      comments: [
        { user: 'user1', text: 'Keep pushing!' },
        { user: 'user2', text: 'Looking strong!' },
      ],
    },
    {
      _id: '4',
      author: {
        _id: 'user4',
        username: 'alice_williams',
        profilePicture: 'https://randomuser.me/api/portraits/women/4.jpg',
        followers: ['user1'],
      },
      caption: 'Exploring new places!',
      image: 'https://randomuser.me/api/portraits/women/4.jpg',
      likes: ['user4', 'user3'],
      comments: [
        { user: 'user1', text: 'Where is this place?' },
        { user: 'user2', text: 'So beautiful!' },
      ],
    },
  ];

  return (
    <div className='bg-black w-full flex flex-col items-center justify-center flex-wrap'>
      <div>
        {post?.map((post) => (
          <PostData key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Posts;
