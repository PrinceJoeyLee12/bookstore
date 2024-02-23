import { createSlice } from '@reduxjs/toolkit';

// ----------------------------------------------------------------------

const initialState = {
  alerts: [],
};

export const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // REMOVE ALERTS
    removeAllAlerts(state) {
      state.alerts = [];
    },
    // REMOVE ALERT
    removeAnAlert(state, action) {
      state.alerts = state.alerts.filter((alert) => alert?.id !== action?.payload);
    },

    // SET ALERT
    setAlert(state, action) {
      state.alerts = [...state.alerts, action.payload];
    },
  },
});

// Reducer
export default slice.reducer;

export const { setAlert, removeAnAlert, removeAllAlerts } = slice.actions;
