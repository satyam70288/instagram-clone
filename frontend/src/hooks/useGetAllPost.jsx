import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


const useGetAllPost = () => {
    const dispatch = useDispatch();
    const { guest } = useSelector((store) => store.auth);
    useEffect(() => {
        if (guest) return;
        const fetchAllPost = async () => {
            try {
                const res = await axios.get('/api/v1/post/all', { withCredentials: true });
                console.log(res)
                if (res.data.success) { 
                    console.log(res.data.posts);
                    dispatch(setPosts(res.data.posts));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllPost();
    }, [dispatch, guest]);
};
export default useGetAllPost;