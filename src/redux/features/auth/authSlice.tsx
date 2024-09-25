import { RootState } from "@/redux/store";
import { createSlice } from "@reduxjs/toolkit";
import { TUser } from "../profile/profileSlice";

type TAuthState = {
  user: null | TUser;
  token: null | string;
};

const initialState: TAuthState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      console.log({ tokenRedux: token });
    },
    logOut: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setUser, logOut } = authSlice.actions;

export default authSlice.reducer;

export const currentUser = (state: RootState) => state.auth.user;
export const userCurrentToken = (state: RootState) => state.auth.token;
