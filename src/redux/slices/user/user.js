import { createSlice } from '@reduxjs/toolkit';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  data: {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    address: null,
    mobileNumber: '',
    billingInfo: [],
  },
  isAuthenticated: false,
  selectedAddressCode: '',
  cart: {
    cartId: '',
    lineItems: [],
  },
  cartIsFetched: false,
  orders: [],
  order: [],
  isUserFetched: false,
  isOrderFetched: false,
  isOrdersFetched: false,
};

export const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state, action) {
      state.isLoading = action.payload === undefined ? true : action.payload;
    },

    logoutUser(state) {
      state = initialState;
    },

    // GET USER DATA
    getUserData(state, action) {
      state.data = {
        ...state.data,
        ...action.payload,
      };
      state.isAuthenticated = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // getUserCartCART UPDATE
    getUserCart(state, action) {
      state.cart = action.payload || state.cart;
      state.cartIsFetched = true;
    },

    cartIsFetchedUpdate(state, action) {
      state.cartIsFetched = action.payload || false;
    },

    setSelectedAddressCode(state, action) {
      state.selectedAddressCode = action.payload;
    },

    updateBillingInfo(state, action) {
      state.data.billingInfo = action.payload || [];
    },
  },
});

// Reducer
export default slice.reducer;

export const { getUserData, startLoading, hasError } = slice.actions;
