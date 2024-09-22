import { RootState } from "@/redux/store";
import { createSlice } from "@reduxjs/toolkit";

const initialState: { rentStartTime: Date | null } = {
  rentStartTime: null,
};
const RentTimeSlice = createSlice({
  name: "rentTime",
  initialState,
  reducers: {
    setRentStartTime: (state, action) => {
      const { rentStartTime } = action.payload;

      state.rentStartTime = rentStartTime;
    },
  },
});

export const { setRentStartTime } = RentTimeSlice.actions;
export default RentTimeSlice.reducer;

export const useStartTime = (state: RootState) => state.startTime;
