import React, { useEffect, useRef, useState } from 'react';
import { CircleX } from 'lucide-react';
import { X } from 'lucide-react';
import { useSearchUserQuery } from '@/services/api';
import { Link } from 'react-router-dom';

const SearchPage = ({ searchActive, setSearchActive }) => {
    const modelRef = useRef();
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
    const { data } = useSearchUserQuery(debouncedSearchTerm);

    const searchHandler = (e) => {
        setSearchTerm(e.target.value);
    };

    const closeModel = (e) => {
        if (modelRef.current && !modelRef.current.contains(e.target)) {
            setSearchActive(false);
        }
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            console.log(searchTerm);
        }, 1000);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    useEffect(() => {
        document.addEventListener('mousedown', closeModel);

        return () => {
            document.removeEventListener('mousedown', closeModel);
        };
    }, []);

    return (
        <div
            ref={modelRef}
            className={`fixed inset-0 h-full backdrop-blur-sm bg-black p-5 rounded-lg overflow-auto z-0 
            transition-all duration-500 ease-in-out ${searchActive ? 'ml-[10%] w-[50%] opacity-100' : 'w-0 opacity-0'} `}
        >
            <div className='flex flex-col gap-10'>
                <div className='flex justify-between'>
                    <h1 className='text-white font-bold text-4xl'>Search</h1>
                    <CircleX className='w-16 h-10 cursor-pointer' onClick={() => setSearchActive(false)} />
                </div>
                <div className='flex items-center gap-3 w-[90%] rounded-lg bg-gray-700 p-3 mx-auto'>
                    <input
                        className='w-full outline-none border-none bg-transparent text-white'
                        type="text"
                        placeholder='Search'
                        value={searchTerm}
                        onChange={searchHandler}
                    />
                    <button className='text-white'>
                        <CircleX onClick={() => setSearchTerm('')} />
                    </button>
                </div>
            </div>
            <hr className='border-t border-gray-500 mt-10' />
            <div>
                <div className='flex justify-between p-4'>
                    <h1 className='text-white text-2xl font-bold'>Recent</h1>
                    <p className='text-xl text-blue-600 cursor-pointer'>Clear all</p>
                </div>
                <div className='flex flex-col gap-6'>
                    {data?.users.map((user) => (
                        <Link to={`/profile/${user._id}`} key={user._id}>
                            <div className='flex items-center gap-4 justify-between'>
                                <div className='w-12 h-12 overflow-hidden rounded-full'>
                                    <img src={`https://instagram-clone-8h2b.onrender.com/${user.profilePicture}`} alt="" />
                                </div>
                                <p>{user.username}</p>
                                <p><X /></p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
