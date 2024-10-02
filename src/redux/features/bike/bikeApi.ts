import { baseApi } from "@/redux/api/baseApi";
const bikeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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
      query: (data) => ({
        url: `/bikes/${data._id}`,
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
  }),
});
export const {
  useGetAllBikesQuery,
  useGetSingleBikeMutation,
  useUpdateSingleBikeMutation,
  useDeleteSingleBikeMutation,
} = bikeApi;
