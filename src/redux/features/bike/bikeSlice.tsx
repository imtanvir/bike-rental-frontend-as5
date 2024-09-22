import { RootState } from "@/redux/store";
import { TBike } from "@/types/intex";
import { createSlice } from "@reduxjs/toolkit";

const initialState: { bikes: TBike[] } = {
  bikes: [
    {
      _id: "",
      image: "",
      name: "",
      description: "",
      pricePerHour: "",
      rating: 0,
      totalRating: 0,
      isAvailable: true,
      cc: 0,
      year: 0,
      model: "",
      brand: "",
      weight: "",
      frameSize: "",
      tireSize: "",
      gears: "",
      features: [""],
    },
  ],
};

const bikeSlice = createSlice({
  name: "bike",
  initialState: initialState,
  reducers: {
    setBikes: (state, action) => {
      const { data } = action.payload;
      state.bikes = data;
    },
  },
});

export const { setBikes } = bikeSlice.actions;

export default bikeSlice.reducer;

export const bikeCurrentBikes = (state: RootState) => state.bike.bikes;
