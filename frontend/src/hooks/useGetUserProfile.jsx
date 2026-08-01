import { setUserProfile } from "@/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetUserProfile = (userId) => {
    const dispatch = useDispatch();
    const { guest } = useSelector((store) => store.auth);

    useEffect(() => {
        if (!userId || guest || userId === 'guest') {
            return;
        }

        const fetchUserProfile = async () => {
            try {
                const res = await axios.get(`/api/v1/user/${userId}/profile`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setUserProfile(res.data.user));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchUserProfile();
    }, [userId, guest, dispatch]);
};
export default useGetUserProfile;
