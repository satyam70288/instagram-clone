import { setMessages } from "@/redux/chatSlice";
import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const useSeenNotification = (id) => {

  // Step 1: Create state variables within the hook
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllNotifications = async () => {
      try {
        setLoading(true); // Set loading state to true when fetching starts
        const res = await axios.patch(
          `/api/v1/update/${id}`,
          { withCredentials: true }
        );
        if (res.data.success) {
            console.log(res.data);
          // Update notifications state
          toast.success(res.data.message);
        }
      } catch (error) {
        console.log(error);
        setError(error); // Set error state in case of a failure
      } finally {
        setLoading(false); // Set loading to false when fetching is complete
      }
    };
      fetchAllNotifications();
    
  }, [id]);

  // Step 2: Return the state variables from the custom hook
  return { notifications, loading, error };
};

export default useSeenNotification;
