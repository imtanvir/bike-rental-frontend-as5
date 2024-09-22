import { baseApi } from "@/redux/api/baseApi";

const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    makeAdvancePayment: builder.mutation({
      query: (amount) => ({
        url: "/create-payment-intent/advance",
        method: "POST",
        body: amount,
        credentials: "include",
      }),
    }),
  }),
});

export const { useMakeAdvancePaymentMutation } = paymentApi;
