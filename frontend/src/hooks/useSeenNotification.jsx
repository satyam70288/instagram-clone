import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

const useSeenNotification = (id) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;

    const markSeen = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.put(
          `/api/v1/notification/update/${id}`,
          {},
          { withCredentials: true }
        );
        if (res.data.success) {
          setSuccess(true);
          toast.success(res.data.message);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    markSeen();
  }, [id]);

  return { loading, error, success };
};

export default useSeenNotification;
