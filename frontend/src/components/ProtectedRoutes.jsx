import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoutes = ({ children }) => {
  const { user, guest } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect only if neither user nor guest is enabled
    if (!user && !guest) {
      navigate("/login");
    }
  }, [user, guest, navigate]);

  return <>{children}</>;
};

export default ProtectedRoutes;
