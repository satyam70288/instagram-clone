import { createSlice } from '@reduxjs/toolkit';

const menuSlice = createSlice({
  name: 'menu',
  initialState: {
    menu: false,
  },
  reducers: {
    // Action to set the menu state
    setMenuHadlar: (state, action) => {
      state.menu = action.payload;
    },
  },
});

export const { setMenuHadlar } = menuSlice.actions; // Export the action creator
export default menuSlice.reducer; // Export the reducer
