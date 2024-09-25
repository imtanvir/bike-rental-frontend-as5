import Spinner from "@/components/Spinner";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  logOut,
  setUser,
  userCurrentToken,
} from "@/redux/features/auth/authSlice";
import { TUser } from "@/redux/features/profile/profileSlice";
import { jwtDecode } from "jwt-decode";
import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const token = useAppSelector(userCurrentToken);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/auth/refresh-token`,
          {
            method: "POST",
            credentials: "include", // Include cookies
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
      } catch (error) {
        console.log({ errorPR: error });
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
    return <Spinner />;
  }

  if (!token) {
    return <Navigate to={"/login"} replace={true} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
