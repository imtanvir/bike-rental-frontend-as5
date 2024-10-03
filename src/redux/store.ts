import { configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { baseApi } from "./api/baseApi";
import authSignUpReducer from "./features/auth/authSignUpSlice";
import authReducer from "./features/auth/authSlice";
import bikeReducer from "./features/bike/bikeSlice";
import userRentals from "./features/booking/rentalSlice";
import profileReducer from "./features/profile/profileSlice";
import rentStartTime from "./features/rentTime/RentTimeSlice";
import allUsers from "./features/users/usersSlice";
const persistConfig = {
  key: "auth",
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: persistedAuthReducer,
    authSignUp: authSignUpReducer,
    profile: profileReducer,
    bike: bikeReducer,
    startTime: rentStartTime,
    rentals: userRentals,
    users: allUsers,
  },
  middleware: (getDefaultMiddlewares) =>
    getDefaultMiddlewares({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;
