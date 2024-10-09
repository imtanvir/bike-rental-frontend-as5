import { baseApi } from "@/redux/api/baseApi";
const bikeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createBike: builder.mutation({
      query: (data) => ({
        url: "/bikes",
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    getAllBikes: builder.query({
      query: () => ({
        url: "/bikes/",
        method: "GET",
        credentials: "include",
      }),
    }),

    getSingleBike: builder.mutation({
      query: (id) => ({
        url: `/bikes/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    updateSingleBike: builder.mutation({
      query: ({ id, data }) => ({
        url: `/bikes/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),

    deleteSingleBike: builder.mutation({
      query: (id) => ({
        url: `/bikes/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),

    contactUs: builder.mutation({
      query: (data) => ({
        url: "/bikes/contact-us",
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
  }),
});
export const {
  useCreateBikeMutation,
  useGetAllBikesQuery,
  useGetSingleBikeMutation,
  useUpdateSingleBikeMutation,
  useDeleteSingleBikeMutation,
  useContactUsMutation,
} = bikeApi;
