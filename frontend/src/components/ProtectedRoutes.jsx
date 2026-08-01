import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearAuthToken, getAuthToken } from "@/lib/authStorage";
import { isTokenExpired } from "@/lib/session";
import { removeAuthUser } from "@/redux/authSlice";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { toast } from "sonner";

const ProtectedRoutes = ({ children }) => {
  const { user, guest } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Guest can browse without a JWT
    if (guest) return;

    const token = getAuthToken();

    // Page open/refresh pe agar token pehle se expire hai → login
    if (user && (!token || isTokenExpired(token))) {
      clearAuthToken();
      dispatch(removeAuthUser());
      dispatch(setSelectedPost(null));
      dispatch(setPosts([]));
      toast.error("Your session has expired. Please log in again.");
      navigate("/login", { replace: true });
      return;
    }

    if (!user && !guest) {
      navigate("/login", { replace: true });
    }
  }, [user, guest, navigate, dispatch]);

  return <>{children}</>;
};

export default ProtectedRoutes;
