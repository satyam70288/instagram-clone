import { setMessages } from "@/redux/chatSlice";
import { setPosts } from "@/redux/postSlice";
import { setStories } from "@/redux/storySlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllStory = () => {
    const dispatch = useDispatch();
    useEffect(() => {
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
    }, []);
};
export default useGetAllStory;