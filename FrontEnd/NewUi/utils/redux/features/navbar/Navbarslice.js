import { createSlice } from "@reduxjs/toolkit";

export const navbarSlice = createSlice({
  name: "navbarSlice",
  initialState: {
    navToggle: false,
  },
  reducers: {
    setSideNavToggle: (state, actions) => {
      return {
        ...state,
        navToggle: actions.payload,
      };
    },
  },
});

export const { setSideNavToggle } = navbarSlice.actions;

export default navbarSlice.reducer;
