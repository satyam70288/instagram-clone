import { useMarkAsReadMutation } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useGetAllNotification from '@/hooks/useGetAllNotification';
import { toast } from 'sonner';
import { useEffect } from 'react';

const NotificationPage = () => {
  const { menu } = useSelector(store => store.menu)
  const { guest } = useSelector(store => store.auth)
  const { notifications, loading, error } = useGetAllNotification();
  const [markAsRead] = useMarkAsReadMutation();
  const navigate = useNavigate()

  useEffect(() => {
    if (guest) navigate('/login');
  }, [guest, navigate]);

  const handleNotificationClick = async (item) => {
    try {
      if (!item.read) {
        await markAsRead(item._id).unwrap();
      }
    } catch {
      // Still navigate even if mark-as-read fails
    }

    if (item.post) {
      navigate(`/post/${item.post?._id || item.post}`);
      return;
    }
    if (item.fromUser) {
      navigate(`/profile/${item.fromUser?._id || item.fromUser}`);
      return;
    }
    toast.info(item.message || 'Notification opened');
  };

  const calculateTimeAgo = (date) => {
    const notificationDate = new Date(date);
    const currentDate = new Date();
    const differenceInSeconds = Math.floor((currentDate - notificationDate) / 1000);
    const days = Math.floor(differenceInSeconds / (3600 * 24));
    const hours = Math.floor((differenceInSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((differenceInSeconds % 3600) / 60);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  if (loading) return <div className='p-10 text-center'>Loading...</div>;
  if (error) return <div className='p-10 text-center text-red-500'>Error loading notifications.</div>;

  return (
    <div className={`p-5 ml-0 w-full 
  ${menu ? 
      ' lg:ml-[6%] lg:w-[calc(100%-6%)]' 
      : 
      ' lg:ml-[16%] lg:w-[calc(100%-16%)]'
  } 
  bg-[#f7f7fb] text-slate-800 min-h-screen flex items-center justify-center`}>
 
      <div className='flex flex-col h-[80vh] w-full max-w-xl bg-white items-center rounded-2xl border border-slate-200 shadow-sm p-5 overflow-y-auto'>
        <div className='text-xl font-semibold text-center mb-4 border-b border-slate-100 pb-2 w-full'>
          Notifications
        </div>
        {notifications.length > 0 ? (
          notifications.map((item) => (
            <div
              key={item._id}
              onClick={() => handleNotificationClick(item)}
              className={`p-3 mb-2 flex justify-between items-center gap-3 w-full rounded-xl border border-slate-100 hover:bg-violet-50 cursor-pointer transition-colors ${item.read ? 'bg-slate-50' : 'bg-white'}`}
            >
              <div className='flex-1 text-sm'>{item.message}</div>
              <div
                className={`w-2.5 h-2.5 rounded-full shrink-0 ${item.read ? 'bg-green-500' : 'bg-violet-500'}`}
                title={item.read ? 'Read' : 'Unread'}
              ></div>
              <p className='text-xs text-slate-400 shrink-0'>{calculateTimeAgo(item.createdAt)}</p>
            </div>
          ))
        ) : (
          <div className='text-center text-slate-400 mt-5'>
            No notifications to show
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
