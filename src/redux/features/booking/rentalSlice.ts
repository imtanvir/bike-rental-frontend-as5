import { RootState } from "@/redux/store";
import { TBike } from "@/types/intex";
import { createSlice } from "@reduxjs/toolkit";

export type TBooking = {
  _id: string | null;
  userId: string | null;
  bikeId: TBike | null;
  startTime: Date | null;
  returnTime: Date | null;
  estimatedReturnTime: Date | null;
  totalCost: number | null;
  isReturned: boolean | null;
  advancePaid: number | null;
  pendingCalculation: boolean | null;
  isPaid: boolean | null;
};
const initialState: { rentals: TBooking[] } = {
  rentals: [
    {
      _id: null,
      userId: null,
      bikeId: null,
      startTime: null,
      returnTime: null,
      estimatedReturnTime: null,
      totalCost: null,
      isReturned: null,
      advancePaid: null,
      pendingCalculation: null,
      isPaid: null,
    },
  ],
};
const rentalsSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    getRentals: (state, action) => {
      const { data } = action.payload;
      state.rentals = data;
    },
  },
});

export const { getRentals } = rentalsSlice.actions;
export default rentalsSlice.reducer;

export const currentUserRentals = (state: RootState) => state.rentals.rentals;
