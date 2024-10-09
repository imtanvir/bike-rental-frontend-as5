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
        credentials: "include",
      }),
      providesTags: ["Rentals"],
    }),
    getSingleRental: builder.query({
      query: (id) => ({
        url: `/rentals/${id}`,
        method: "GET",
      }),
      providesTags: ["Rentals"],
    }),
    returnBikeByUser: builder.mutation({
      query: ({ data, id }) => ({
        url: `/rentals/end_ride/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Rentals"],
    }),
    rentCalculation: builder.mutation({
      query: (id) => ({
        url: `/rentals/rent-calculate/${id}`,
        method: "PUT",
        credentials: "include",
      }),
    }),
    getAllRentals: builder.query({
      query: () => ({
        url: "/rentals/getAll",
        method: "GET",
        credentials: "include",
      }),
    }),
    discountTotalCostApply: builder.mutation({
      query: (data) => ({
        url: "/rentals/discount-total-cost-update",
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
    rentPaidUpdate: builder.mutation({
      query: (id) => ({
        url: `/rentals/paid/${id}`,
        method: "PUT",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useRentABikeMutation,
  useGetRentalsQuery,
  useGetSingleRentalQuery,
  useReturnBikeByUserMutation,
  useRentCalculationMutation,
  useGetAllRentalsQuery,
  useDiscountTotalCostApplyMutation,
  useRentPaidUpdateMutation,
} = bookingApi;
