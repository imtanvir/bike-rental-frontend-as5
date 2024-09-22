import { createSlice } from "@reduxjs/toolkit";

type TUserDetails = {
  name: null | string;
  email: null | string;
  password: null | string;
  phone: null | string;
  address: null | string;
};

const initialState: TUserDetails = {
  name: null,
  email: null,
  password: null,
  phone: null,
  address: null,
};

const authSignUpSlice = createSlice({
  name: "authSignUp",
  initialState: initialState,
  reducers: {
    signUp: (state, action) => {
      const { name, email, password, phone, address } = action.payload;
      state.name = name;
      state.email = email;
      state.password = password;
      state.phone = phone;
      state.address = address;
    },
  },
});

export const { signUp } = authSignUpSlice.actions;

export default authSignUpSlice.reducer;
