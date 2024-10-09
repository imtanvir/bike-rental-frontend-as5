import { baseApi } from "@/redux/api/baseApi";

const couponApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCoupon: builder.mutation({
      query: (data) => ({
        url: "/coupon/create",
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    getCoupons: builder.query({
      query: () => ({
        url: "/coupon/all-coupons",
        method: "GET",
        credentials: "include",
      }),
    }),
    checkAndUseCoupon: builder.mutation({
      query: (data) => ({
        url: "/coupon/coupon-check-use",
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),

    deleteCoupon: builder.mutation({
      query: (id) => ({
        url: `/coupon/delete-coupon/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useCreateCouponMutation,
  useGetCouponsQuery,
  useCheckAndUseCouponMutation,
  useDeleteCouponMutation,
} = couponApi;
