import { useEffect, useMemo, useRef, useState } from 'react';
import { CircleX, X } from 'lucide-react';
import { useSearchUserQuery } from '@/services/api';
import { Link, useNavigate } from 'react-router-dom';
import { resolveMediaUrl } from '@/lib/media';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

const SearchPage = ({ searchActive, setSearchActive }) => {
    const modelRef = useRef();
    const navigate = useNavigate();
    const { guest, suggestedUsers } = useSelector((store) => store.auth);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const { data } = useSearchUserQuery(debouncedSearchTerm, {
        skip: guest || !debouncedSearchTerm.trim(),
    });

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
        }, 400);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    useEffect(() => {
        document.addEventListener('mousedown', closeModel);
        return () => document.removeEventListener('mousedown', closeModel);
    }, []);

    const results = useMemo(() => {
        if (guest) {
            const q = debouncedSearchTerm.trim().toLowerCase();
            if (!q) return suggestedUsers || [];
            return (suggestedUsers || []).filter((u) => u.username?.toLowerCase().includes(q));
        }
        return data?.users || [];
    }, [guest, suggestedUsers, debouncedSearchTerm, data]);

    return (
        <div
            ref={modelRef}
            className={`fixed inset-y-0 left-[16%] z-20 h-full w-[min(420px,50%)] overflow-auto rounded-r-2xl border-r border-slate-200 bg-white p-5 shadow-xl
            transition-all duration-300 ${searchActive ? 'opacity-100' : 'pointer-events-none w-0 opacity-0'} `}
        >
            <div className='flex flex-col gap-8'>
                <div className='flex justify-between items-center'>
                    <h1 className='text-slate-900 font-bold text-2xl'>Search</h1>
                    <CircleX className='w-8 h-8 cursor-pointer text-slate-400' onClick={() => setSearchActive(false)} />
                </div>
                {guest && (
                    <p className='rounded-xl bg-violet-50 px-3 py-2 text-sm text-violet-700'>
                        Guest search shows demo people only.{' '}
                        <button className='font-semibold underline' onClick={() => { setSearchActive(false); navigate('/login'); toast.info('Log in for full search.'); }}>Log in</button>
                    </p>
                )}
                <div className='flex items-center gap-3 w-full rounded-xl bg-slate-100 p-3'>
                    <input
                        className='w-full outline-none border-none bg-transparent text-slate-800'
                        type="text"
                        placeholder='Search people'
                        value={searchTerm}
                        onChange={searchHandler}
                    />
                    <button type='button' className='text-slate-400' onClick={() => setSearchTerm('')}>
                        <CircleX />
                    </button>
                </div>
            </div>
            <hr className='border-t border-slate-100 mt-6' />
            <div className='mt-4 flex flex-col gap-3'>
                {results.map((user) => (
                    <Link
                        to={guest ? '/login' : `/profile/${user._id}`}
                        key={user._id}
                        onClick={() => setSearchActive(false)}
                        className='flex items-center gap-3 rounded-xl p-2 hover:bg-violet-50'
                    >
                        <div className='w-11 h-11 overflow-hidden rounded-full bg-slate-100'>
                            <img src={resolveMediaUrl(user.profilePicture)} alt="" className='h-full w-full object-cover' />
                        </div>
                        <div className='flex-1'>
                            <p className='font-semibold text-slate-800'>{user.username}</p>
                            <p className='text-xs text-slate-500 line-clamp-1'>{user.bio || 'PicShare user'}</p>
                        </div>
                        <X className='h-4 w-4 text-slate-300' />
                    </Link>
                ))}
                {!results.length && debouncedSearchTerm && (
                    <p className='text-center text-sm text-slate-400 py-8'>No users found</p>
                )}
            </div>
        </div>
    );
};

export default SearchPage;
