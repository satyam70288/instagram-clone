import useGetAllNotification from '@/hooks/useGetAllNotification'
import { useNotificationQuery } from '@/services/api'
import React from 'react'

const NotificationPage = () => {

    const { data, isLoading,  } = useNotificationQuery();
    console.log(data)
    const { notifications, loading, error } = useGetAllNotification();

    const calculateTimeAgo = (date) => {
        const notificationDate = new Date(date);
        const currentDate = new Date();
        const differenceInSeconds = Math.floor((currentDate - notificationDate)/1000); 
        const days = Math.floor(differenceInSeconds / (3600 * 24));
        const hours = Math.floor((differenceInSeconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((differenceInSeconds % 3600) / 60);

        if (days > 0) {
            return `${days} day${days > 1 ? 's' : ''} ago`;
        } else if (hours > 0) {
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else if (minutes > 0) {
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else {
            return 'Just now';
        }
    };
    // if (loading) return <div>Loading...</div>;
    // if (error) return <div>Error loading notifications.</div>;

    // Check if 'data' and 'data.notifications' exist before mapping over notifications
    if (!data || !data.notifications) return <div>No notifications available.</div>;


    return (
        <div className='p-5 ml-[16%] w-[calc(100%-16%)]  bg-black text-white  h-full flex items-center justify-center'>
            <div className='flex flex-col h-[80vh] w-[40%] bg-gray-900 items-center rounded-lg shadow-lg p-5'>
                <div className='text-xl font-semibold text-center mb-4 border-b border-gray-700 pb-2'>
                    Notifications
                </div>
                {notifications.map((item) => {
                    return (
                        <div className={`p-2 flex justify-between items-center bg-gray-800 w-full rounded-md border border-gray-700 hover:bg-gray-700 transition-colors duration-200 ${item.read ? 'bg-gray-700' : ''}`}>
                            <div className='w-1/2'>{item.message}</div>
                            <div
                                className={`w-3 h-3 rounded-full ${item.read ? 'bg-green-500' : 'bg-red-500'
                                    }`}
                                title={item.read ? 'Read' : 'Unread'}
                            ></div>
                            <p className='text-white'>{calculateTimeAgo(item.createdAt)}</p>
                        </div>

                    )
                })}
                {notifications.length === 0 && (
                    <div className='text-center text-gray-500 mt-5'>
                        No notifications to show
                    </div>
                )}
            </div>
        </div>
    )
}

export default NotificationPage