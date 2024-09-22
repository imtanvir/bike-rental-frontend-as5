import { baseApi } from "./../../api/baseApi";
const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/login",
        method: "POST",
        body: userInfo,
      }),
    }),
    signUp: builder.mutation({
      query: (userDetails) => ({
        url: "/auth/signup",
        method: "post",
        body: userDetails,
      }),
    }),
  }),
});

export const { useLoginMutation, useSignUpMutation } = authApi;
