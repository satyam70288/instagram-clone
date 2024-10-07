import React from 'react';
import useGetAllNotification from '@/hooks/useGetAllNotification';
import { useMarkAsReadMutation } from '@/services/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const NotificationPage = () => {
  const { notifications, loading, error } = useGetAllNotification();
  const [markAsRead] = useMarkAsReadMutation();
const navigate=useNavigate()
  // Handle the click event for marking a notification as read
  const handleNotificationClick = async (id) => {
    navigate(`/profile/${id}`);
  };

  // Calculate the time since the notification was created
  const calculateTimeAgo = (date) => {
    const notificationDate = new Date(date);
    const currentDate = new Date();
    const differenceInSeconds = Math.floor((currentDate - notificationDate) / 1000);
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading notifications.</div>;

  return (
    <div className='p-5 ml-[16%] w-[calc(100%-16%)] bg-black text-white h-full flex items-center justify-center'>
      <div className='flex flex-col h-[80vh] w-[40%] bg-gray-900 items-center rounded-lg shadow-lg p-5 overflow-y-auto'>
        <div className='text-xl font-semibold text-center mb-4 border-b border-gray-700 pb-2'>
          Notifications
        </div>
        {notifications.length > 0 ? (
          notifications.map((item) => (
            <div
              key={item._id}  // Ensure each notification has a unique key
              onClick={() => handleNotificationClick(item.user)}
              className={`p-2 flex justify-between items-center bg-gray-800 w-full rounded-md border border-gray-700 hover:bg-gray-700 transition-colors duration-200 ${item.read ? 'bg-gray-700' : ''}`}
            >
              <div className='w-1/2'>{item.message}</div>
              <div
                className={`w-3 h-3 rounded-full ${item.read ? 'bg-green-500' : 'bg-red-500'}`}
                title={item.read ? 'Read' : 'Unread'}
              ></div>
              <p className='text-white'>{calculateTimeAgo(item.createdAt)}</p>
            </div>
          ))
        ) : (
          <div className='text-center text-gray-500 mt-5'>
            No notifications to show
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
