import Loader from "@/components/Loader";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  currentUser,
  logOut,
  setUser,
  userCurrentToken,
} from "@/redux/features/auth/authSlice";
import { TUser } from "@/redux/features/profile/profileSlice";
import { jwtDecode } from "jwt-decode";
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const token = useAppSelector(userCurrentToken);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const userCurrent = useAppSelector(currentUser);
  const location = useLocation();
  const pathname = location.pathname;
  const rolePathValue = pathname.split("/")[1];

  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/auth/refresh-token`,
          {
            method: "POST",
            credentials: "include",
          }
        );
        const data = await response.json();

        if (data?.data) {
          // Update the token in Redux
          const user = jwtDecode(data.data);
          dispatch(setUser({ user, token: data.data }));
        } else {
          // If refresh token is invalid, log out
          dispatch(logOut());
        }
      } catch {
        dispatch(logOut());
      }

      setLoading(false);
    };

    if (token) {
      const decoded: TUser = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      // If token expired, try refreshing the access token
      if ((decoded.exp as number) < currentTime) {
        refreshAccessToken();
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [token, dispatch]);

  if (loading) {
    return <Loader />;
  }

  if (!token) {
    return <Navigate to={"/login"} replace={true} />;
  } else if (userCurrent?.role !== "user" && rolePathValue === "payment") {
    return <Navigate to={"*"} replace={true} />;
  } else if (
    userCurrent &&
    userCurrent.role !== rolePathValue &&
    rolePathValue !== "payment"
  ) {
    return <Navigate to={"*"} replace={true} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
