import { RootState } from "@/redux/store";
import { createSlice } from "@reduxjs/toolkit";
export type TUser = {
  _id: null | string;
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

const initialState: TUser = {
  _id: null,
  name: null,
  email: null,
  password: null,
  phone: null,
  address: null,
  lastLogin: null,
  role: null,
  createdAt: null,
  updatedAt: null,
  exp: null,
};
const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    getProfile: (state, action) => {
      const {
        _id,
        name,
        email,
        password,
        phone,
        address,
        lastLogin,
        role,
        createdAt,
        updatedAt,
        exp,
      } = action.payload;
      state._id = _id;
      state.name = name;
      state.email = email;
      state.password = password;
      state.phone = phone;
      state.address = address;
      state.lastLogin = lastLogin;
      state.role = role;
      state.createdAt = createdAt;
      state.updatedAt = updatedAt;
      state.exp = exp;
    },
  },
});

export const { getProfile } = profileSlice.actions;

export default profileSlice.reducer;

export const currentUser = (state: RootState) => state.profile;
