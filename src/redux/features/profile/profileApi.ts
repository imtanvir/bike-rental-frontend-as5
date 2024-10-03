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
      query: ({ id, data }) => ({
        url: `/users/me/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const { useUserProfileQuery, useUpdateUserProfileMutation } = profileApi;
