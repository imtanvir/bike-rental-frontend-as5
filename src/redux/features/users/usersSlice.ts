import { RootState } from "@/redux/store";
import { createSlice } from "@reduxjs/toolkit";
type TImage = {
  id: string;
  url: string;
  isRemove: boolean;
};
export type TUser = {
  _id: null | string;
  image: TImage[] | null;
  name: null | string;
  email: null | string;
  password: null | string;
  phone: null | string;
  address: null | string;
  lastLogin: null | string;
  role: null | string;
  createdAt: null | string;
  updatedAt: null | string;
  exp: null | number;
};

const initialState: { users: TUser[] | null } = {
  users: null,
};
const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setAllUsers: (state, action) => {
      const { data } = action.payload;
      state.users = data;
    },
  },
});

export const { setAllUsers } = usersSlice.actions;

export default usersSlice.reducer;

export const currentAllUser = (state: RootState) => state.users.users;
