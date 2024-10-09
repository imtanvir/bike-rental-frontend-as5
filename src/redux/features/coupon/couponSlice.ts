import { RootState } from "@/redux/store";
import { createSlice } from "@reduxjs/toolkit";
import { TUser } from "../profile/profileSlice";

export interface TCoupon {
  _id: string | null;
  couponCode: string | null;
  userId: TUser | null;
  discount: number | null;
  createDate: Date | null;
  isUsed: boolean | null;
  isExpired: boolean | null;
}
const initialState: { coupons: TCoupon[] | [] } = {
  coupons: [],
};
const couponSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setCoupons: (state, action) => {
      const { data } = action.payload;
      state.coupons = data;
    },
  },
});

export const { setCoupons } = couponSlice.actions;
export const currentCoupons = (state: RootState) => state.coupon.coupons;
export default couponSlice.reducer;
