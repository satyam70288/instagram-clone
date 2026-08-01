import { setSuggestedUsers } from "@/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


const useGetSuggestedUsers = () => {
    const dispatch = useDispatch();
    const { guest } = useSelector((store) => store.auth);
    useEffect(() => {
        if (guest) return;
        const fetchSuggestedUsers = async () => {
            try {
                const res = await axios.get('/api/v1/user/suggested', { withCredentials: true });
                if (res.data.success) { 
                    dispatch(setSuggestedUsers(res.data.users));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSuggestedUsers();
    }, [dispatch, guest]);
};
export default useGetSuggestedUsers;