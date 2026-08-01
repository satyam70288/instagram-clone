import { setStories } from "@/redux/storySlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllStory = () => {
    const dispatch = useDispatch();
    const { guest, user } = useSelector((store) => store.auth);
    useEffect(() => {
        if (guest || !user) return;
        const fetchAllStory = async () => {
            try {
                const res = await axios.get(`/api/v1/story/get/`, { withCredentials: true });
                if (res.data.success) {  
                    dispatch(setStories(res.data.stories));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllStory();
    }, [dispatch, guest, user]);
};
export default useGetAllStory;