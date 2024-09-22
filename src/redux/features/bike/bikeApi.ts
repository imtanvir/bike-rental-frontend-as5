import { baseApi } from "@/redux/api/baseApi";
const bikeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBikes: builder.query({
      query: () => ({
        url: "/bikes/",
        method: "GET",
      }),
    }),

    getSingleBike: builder.mutation({
      query: (id) => ({
        url: `/bikes/${id}`,
        method: "GET",
      }),
    }),
  }),
});
export const { useGetAllBikesQuery, useGetSingleBikeMutation } = bikeApi;
