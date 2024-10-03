import { baseApi } from "@/redux/api/baseApi";
const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUser: builder.query({
      query: () => ({
        url: "/users/all-users",
        method: "GET",
        credentials: "include",
      }),
    }),

    updateUserByAdmin: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/user/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),

    deleteUserByAdmin: builder.mutation({
      query: (id) => ({
        url: `/admin/delete-user/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useGetAllUserQuery,
  useUpdateUserByAdminMutation,
  useDeleteUserByAdminMutation,
} = usersApi;
