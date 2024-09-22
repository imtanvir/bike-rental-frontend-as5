import { baseApi } from "@/redux/api/baseApi";
const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    userProfile: builder.query({
      query: () => ({
        url: "/users/me",
        method: "GET",
        credentials: "include",
      }),
    }),

    updateUserProfile: builder.mutation({
      query: (data) => ({
        url: "/users/me",
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
  }),
});

export const { useUserProfileQuery, useUpdateUserProfileMutation } = profileApi;
