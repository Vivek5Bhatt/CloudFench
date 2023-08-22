"use client";
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./features/counter/counterSlice";
import navbarSlice from "./features/navbar/Navbarslice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    navbar: navbarSlice,
  },
});
