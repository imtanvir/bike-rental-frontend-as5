import { baseApi } from "@/redux/api/baseApi";
const testimonialApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTestimonial: builder.mutation({
      query: (data) => ({
        url: "/testimonial/create",
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),

    getAllTestimonial: builder.query({
      query: () => ({
        url: "/testimonial/all-testimonial",
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const { useCreateTestimonialMutation, useGetAllTestimonialQuery } =
  testimonialApi;
