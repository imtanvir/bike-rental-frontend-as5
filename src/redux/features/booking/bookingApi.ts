import { baseApi } from "@/redux/api/baseApi";

const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    rentABike: builder.mutation({
      query: (rentInfo) => ({
        url: "/rentals/",
        method: "POST",
        body: rentInfo,
      }),
      invalidatesTags: ["Rentals"],
    }),
    getRentals: builder.query({
      query: () => ({
        url: "/rentals/",
        method: "GET",
      }),
      providesTags: ["Rentals"],
    }),
  }),
});

export const { useRentABikeMutation, useGetRentalsQuery } = bookingApi;
