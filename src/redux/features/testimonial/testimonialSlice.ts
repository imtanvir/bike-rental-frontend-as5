import { RootState } from "@/redux/store";
import { TBike } from "@/types/intex";
import { createSlice } from "@reduxjs/toolkit";
import { TUser } from "../users/usersSlice";

export interface TTestimonial {
  _id: string | null;
  userId: TUser | null;
  bikeId: TBike | null;
  message: string | null;
  rating: number | null;
}

const initialState: { testimonials: TTestimonial[] | null } = {
  testimonials: null,
};
const testimonialSlice = createSlice({
  name: "testimonials",
  initialState,
  reducers: {
    setTestimonials: (state, action) => {
      const { data } = action.payload;
      state.testimonials = data;
    },
  },
});

export const { setTestimonials } = testimonialSlice.actions;

export default testimonialSlice.reducer;

export const currentTestimonial = (state: RootState) =>
  state.testimonials.testimonials;
