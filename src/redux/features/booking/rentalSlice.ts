import { RootState } from "@/redux/store";
import { TBike } from "@/types/intex";
import { createSlice } from "@reduxjs/toolkit";
import { TUser } from "../users/usersSlice";

export type TBooking = {
  _id: string | null;
  userId: TUser | null;
  bikeId: TBike | null;
  startTime: Date | null;
  returnTime: Date | null;
  estimatedReturnTime: Date | null;
  totalCost: number | null;
  isReturned: boolean | null;
  advancePaid: number | null;
  pendingCalculation: boolean | null;
  isPaid: boolean | null;
  discountApplied: boolean | null;
  getBackAmount: number | null;
  feedBackSubmitted: boolean | null;
};
const initialState: { rentals: TBooking[] | null } = {
  rentals: null,
};
const rentalsSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setRentals: (state, action) => {
      const { data } = action.payload;
      state.rentals = data;
    },
  },
});

export const { setRentals } = rentalsSlice.actions;
export default rentalsSlice.reducer;

export const currentUserRentals = (state: RootState) => state.rentals.rentals;
