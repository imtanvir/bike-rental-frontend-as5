import { logOut } from "@/redux/features/auth/authSlice";
import {
  BaseQueryApi,
  BaseQueryFn,
  createApi,
  DefinitionType,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { setUser } from "../features/auth/authSlice";
import { RootState } from "../store";

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_BASE_URL}/api/`,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    console.log({ tokenBA: token });
    if (token) {
      console.log("hi from token roket");
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithRefreshToken: BaseQueryFn<
  FetchArgs,
  BaseQueryApi,
  DefinitionType
> = async (args, api, extraOptions): Promise<any> => {
  let result = await baseQuery(args, api, extraOptions);

  console.log({ result });
  if (result && result.error && result.error?.status === 401) {
    // send refresh token
    console.log("send refresh token");
    console.log({ result });
    const res = await fetch(
      `${import.meta.env.VITE_BASE_URL}/api/auth/refresh-token`,
      {
        method: "POST",
        credentials: "include",
      }
    );
    console.log(res);
    const data = await res.json();
    console.log({ dres: data });
    if (data?.data) {
      console.log("hi from new access!");
      const user = (api.getState() as RootState).auth.user;
      console.log({ newUser: user });
      api.dispatch(
        setUser({
          user,
          token: data.data,
        })
      );
      result = await baseQuery(args, api, extraOptions);
    } else {
      console.log({ problem: "hi from baseAPi" });

      api.dispatch(logOut());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: ["Rentals"],
  endpoints: () => ({}),
});
