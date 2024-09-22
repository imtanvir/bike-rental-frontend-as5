// Infer the `RootState` and `AppDispatch` types from the store itself
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
