// Actions

// ----------------------------------------------------------------------

export const getUser = async (email = '', userSub = '') => {};
export const registerUser = async (data) => {};

export const loginUser = async (data) => {};

export const logoutUser = async (shouldInitializeGuestUser = false) => {};

// export const initializeLocal

export const verifyToken = async (data) => {};

export const setSelectedAddressCode = (code = '') => {};

export const getCart = async () => {};

export const saveBillingAddress = async (newBillingAdress = null) => {};

export const updateUserProfileData = async (otherData = null) => {};

export const deleteAddress = async (id) => {};

export const updateLocalCart = (onlineCart) => {};
