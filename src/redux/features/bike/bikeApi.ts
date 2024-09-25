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
  }),
});
export const { useGetAllBikesQuery, useGetSingleBikeMutation } = bikeApi;
