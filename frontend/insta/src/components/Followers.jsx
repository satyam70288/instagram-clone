import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from './ui/button'
import { useGetFollowingOrFollowerQuery } from '@/services/api'

const Followers = () => {
    const [follower, setFollower] = useState([])
    const params = useParams();
    const userId = params.id;
    const { data, error, isLoading, isSuccess } = useGetFollowingOrFollowerQuery(userId);

    // const getFollowingFollowers = async () => {
    //     try {
    //         const res = await axios.get(`http://localhost:8000/api/v1/user/getFollowingOrFollower/${userId}`, { withCredentials: true });
    //         if (res.data.success) {
    //             toast.success(res.data.message);
    //             setFollower(res.data.followers)
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    // useEffect(() => {
    //     getFollowingFollowers();
    // },[])
    useEffect(() => {
        if (isSuccess) {
          toast.success(data.message);
          setFollower(data.followers);
        } else if (error) {
          console.error('Error fetching data:', error);
        }
      }, [isSuccess, data, error]);

    return (
        <div className="ml-[16%] w-[calc(100%-16%)] h-screen flex justify-center items-center bg-[#121212]/80 backdrop-blur-sm">
            <div className="bg-gray-800 rounded-lg max-w-md w-full p-4">
                <div className="flex flex-col">
                    <div className="w-full border-b-2 border-gray-700 p-2 shadow-lg">
                        <span className="block text-center text-white font-semibold">Followers</span>
                    </div>
                    <div className="mt-4 max-h-[60vh] overflow-y-auto">
                    {follower.map((item, key) => (
                            <div key={key} className="flex items-center justify-between p-2 hover:bg-gray-700 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <img src={`http://localhost:8000/${item.profilePicture}`}  alt={item.username} className="h-10 w-10 rounded-full" />
                                    <span className="text-white">{item.username}</span>
                                </div>
                                <Button className="text-red-500">Remove</Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Followers
