import PropTypes from 'prop-types';
import { createContext, useCallback, useEffect, useReducer } from 'react';
import { Auth } from 'aws-amplify';
import { registerUser, getUser, loginUser, logoutUser } from 'redux/slices/user/actions';
import { encodePHPhoneNumber } from 'utils/common/stringHelper';
import { setLocalStorageItem, getLocalStorageItem, removeLocalStorageItem } from 'utils/index';
import { dispatch as reduxDispatch } from 'redux/store';
import { slice as userSlice } from 'redux/slices/user/user';
import { slice as alertSlice } from 'redux/slices/alert/alert';
import { EMAIL_STATUS, UTILS } from 'constants/index';
import uuidv4 from 'utils/uuidv4';

// ----------------------------------------------------------------------

// CAUTION: User Cognito is slily difference from firebase, so be sure to read the doc carefully.

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const handlers = {
  AUTHENTICATE: (state, action) => {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  },
  INITIALIZED: (state, action) => {
    const { isAuthenticated, user, isInitialized } = action.payload;

    return {
      ...state,
      isInitialized: isInitialized || false,
      isAuthenticated,
      user,
    };
  },
};

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state);

const AuthContext = createContext({
  ...initialState,
  method: 'cognito',
  login: () => Promise.resolve(),
  register: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  verify: () => Promise.resolve(),
  resendConfirmation: () => Promise.resolve(),
  forgotPasswordSendEmail: () => Promise.resolve(),
  resetPassword: () => Promise.resolve(),
});

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const getSession = useCallback(async () => {
    reduxDispatch(userSlice.actions.startLoading());
    // try {
    //   await Auth.currentSession()
    //     .then(async (data) => {
    //       const useSub = data?.accessToken?.payload?.sub || '';
    //       removeLocalStorageItem(UTILS.TOKEN);
    //       const user = await getUser(undefined, useSub);
    //       reduxDispatch(userSlice.actions.getUserData({ isVerified: true }));
    //       const localUnverfiedUser = getLocalStorageItem(EMAIL_STATUS.UNVERIFIED_EMAIL);
    //       if (localUnverfiedUser) {
    //         removeLocalStorageItem(EMAIL_STATUS.UNVERIFIED_EMAIL);
    //       }
    //       dispatch({
    //         type: 'AUTHENTICATE',
    //         payload: { isAuthenticated: true, user },
    //       });
    //     })
    //     .catch(async (err) => {
    //       const storedToken = getLocalStorageItem(UTILS.TOKEN);
    //       const unverifiedEmail = getLocalStorageItem(EMAIL_STATUS.UNVERIFIED_EMAIL);
    //       if (unverifiedEmail) {
    //         reduxDispatch(userSlice.actions.getUserData({ email: unverifiedEmail }));
    //       }
    //       if (err === 'No current user' && storedToken) {
    //         const { user, success = false } = await verifyToken({ token: storedToken, shouldCreateNewOne: true });
    //         dispatch({
    //           type: 'AUTHENTICATE',
    //           payload: { isAuthenticated: true, user },
    //         });
    //         return { success };
    //       }
    //       dispatch({
    //         type: 'INITIALIZED',
    //         payload: { isAuthenticated: true, user: {}, isInitialized: true },
    //       });
    //       await logout();
    //     });
    // } catch (error) {
    //   await logout();
    // }
    dispatch({
      type: 'INITIALIZED',
      payload: { isAuthenticated: true, user: {}, isInitialized: true },
    });
  }, []);

  const initial = useCallback(async () => {
    try {
      await getSession();
    } catch {
      dispatch({
        type: 'AUTHENTICATE',
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
  }, [getSession]);

  useEffect(() => {
    initial();
  }, [initial]);

  const login = useCallback(
    async (email, password) => {
      return Auth.signIn(email, password)
        .then(async (user) => {
          await getSession();
          return { success: true };
        })
        .catch(async (err) => {
          if (Object.values(err)?.includes('UserNotConfirmedException')) {
            setLocalStorageItem({ [EMAIL_STATUS.UNVERIFIED_EMAIL]: email });
            // Check if authentication success

            const loginUnVerifiedUser = await loginUser({
              email,
              password,
            });

            const loginDataResponse = loginUnVerifiedUser?.data?.loginUser;
            const user = JSON.parse(loginDataResponse)?.user;
            const token = JSON.parse(loginDataResponse)?.token;
            const errors = JSON.parse(loginDataResponse)?.errors;

            if (errors?.length) {
              const firstError = JSON.parse(errors?.[0]?.message || '');
              // Remove this user from
              if (firstError?.error_type === 'no_user_error') {
                return {
                  error: true,
                  message: firstError?.message || 'Email or/and Password is incorrect', // TODO create user if user doens't exist but is already in cognito
                };
              }

              return {
                error: true,
                message: firstError?.message || 'Password is incorrect',
              };
            }

            if (user?.email) {
              const { password, ...userDataToRedux } = user;
              reduxDispatch(userSlice.actions.getUserData(userDataToRedux));
              dispatch({
                type: 'AUTHENTICATE',
                payload: { isAuthenticated: true, user: userDataToRedux },
              });
            } else {
              dispatch({
                type: 'INITIALIZED',
                payload: { isAuthenticated: false, user: {}, isInitialized: true },
              });
            }

            if (token) {
              setLocalStorageItem({ [UTILS.TOKEN]: token });
            }

            return { success: true };
          }

          dispatch({
            type: 'INITIALIZED',
            payload: { isAuthenticated: false, user: {}, isInitialized: true },
          });
          return {
            error: true,
            message: err?.message || 'Email or/and Password is incorrect',
          };
        });
    },
    [getSession],
  );

  const logout = async () => {
    try {
      await Auth.signOut();
      await logoutUser(true);
    } catch (error) {
      console.log('error logging out: ', error);
    }
    dispatch({
      type: 'INITIALIZED',
      payload: { isAuthenticated: false, user: {}, isInitialized: true },
    });
  };

  const register = async (email, phoneNumber, password, firstName, lastName) => {
    const number = encodePHPhoneNumber(phoneNumber);
    return Auth.signUp({
      username: email,
      password,
      attributes: {
        given_name: firstName,
        family_name: lastName,
        phone_number: number,
        name: `${firstName} ${lastName}`,
      },
      autoSignIn: {
        enabled: true,
      },
    })
      .then(async (user) => {
        const { success, userData } = await registerUser({
          userSub: user?.userSub,
          firstName,
          lastName,
          email,
          phoneNumber,
          password,
        });

        if (!success) {
          dispatch({
            type: 'INITIALIZED',
            payload: { isAuthenticated: false, user: {}, isInitialized: true },
          });
          return {
            error: true,
            message: 'We are unable to register user as of the moment...',
          };
        }

        dispatch({
          type: 'AUTHENTICATE',
          payload: { isAuthenticated: true, user: userData },
        });
        setLocalStorageItem({ [EMAIL_STATUS.UNVERIFIED_EMAIL]: email });

        return {
          success: true,
        };
      })
      .catch(async (err) => {
        if (Object.values(err)?.includes('UsernameExistsException')) {
          setLocalStorageItem({ [EMAIL_STATUS.UNVERIFIED_EMAIL]: email });
          reduxDispatch(userSlice.actions.getUserData({ email }));
          return {
            error: true,
            message: 'User Already exist please login!',
          };
        }
        dispatch({
          type: 'INITIALIZED',
          payload: { isAuthenticated: false, user: {}, isInitialized: true },
        });
        return {
          error: true,
          message: err?.message || 'We are having trouble as of the moment!',
        };
      });
  };

  const verify = async (email, code) => {
    reduxDispatch(userSlice.actions.startLoading());
    try {
      return await Auth.confirmSignUp(email, String(code))
        .then(async (data) => {
          if (data === 'SUCCESS') {
            removeLocalStorageItem(EMAIL_STATUS.UNVERIFIED_EMAIL);
            removeLocalStorageItem(UTILS.TOKEN);
            await getUser(email);
            reduxDispatch(
              alertSlice.actions.setAlert({
                id: uuidv4(),
                type: 'success',
                message: 'Success fully verified',
                timeout: 4000,
              }),
            );
            return {
              success: true,
            };
          }
        })
        .catch((err) => {
          if (Object.values(err)?.includes('CodeMismatchException')) {
            return {
              error: true,
              message: "Code isn't corrent. Please check your the code we sent from your email.",
            };
          }
          return {
            error: true,
            message: err?.message || 'We are having trouble as of the moment',
          };
        });
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const resendConfirmation = async (email) => {
    const username = email || getLocalStorageItem(EMAIL_STATUS.UNVERIFIED_EMAIL);
    if (!username) {
      reduxDispatch(
        alertSlice.actions.setAlert({
          id: uuidv4(),
          type: 'error',
          message: `No email is provided`,
          timeout: 3000,
        }),
      );
    }

    try {
      await Auth.resendSignUp(username)
        .then(async (data) => {
          reduxDispatch(
            alertSlice.actions.setAlert({
              id: uuidv4(),
              type: 'success',
              message: `We've sent you the code. Please check your email ${email}`,
              timeout: 4000,
            }),
          );

          return {
            success: true,
          };
        })
        .catch((err) => {
          const message = err?.message || `We are having trouble resending a code as of the moment`;
          reduxDispatch(
            alertSlice.actions.setAlert({
              id: uuidv4(),
              type: 'error',
              message,
              timeout: 3000,
            }),
          );
        });
    } catch (error) {
      console.log('Error:', error);
      reduxDispatch(
        alertSlice.actions.setAlert({
          id: uuidv4(),
          type: 'error',
          message: `We are having trouble resending a code as of the moment`,
          timeout: 3000,
        }),
      );
    }
  };

  const forgotPasswordSendEmail = async (email) => {
    const username = email || getLocalStorageItem(EMAIL_STATUS.UNVERIFIED_EMAIL);
    if (!username) {
      reduxDispatch(
        alertSlice.actions.setAlert({
          id: uuidv4(),
          type: 'error',
          message: `No email is provided`,
          timeout: 3000,
        }),
      );
      return {
        success: false,
      };
    }

    try {
      return await Auth.forgotPassword(username)
        .then(async (data) => {
          reduxDispatch(userSlice.actions.getUserData({ email: username }));
          reduxDispatch(
            alertSlice.actions.setAlert({
              id: uuidv4(),
              type: 'success',
              message: `We've sent you the code. Please check your email`,
              timeout: 8000,
            }),
          );

          return {
            success: true,
          };
        })
        .catch((err) => {
          let message = err?.message || `We are having trouble resending a code as of the moment`;
          if (Object.values(err).includes('UserNotFoundException')) {
            message = 'User is not found';
          } else if (Object.values(err).includes('InvalidParameterException')) {
            message = 'User is not verified! Please verify the email first';
          }
          reduxDispatch(
            alertSlice.actions.setAlert({
              id: uuidv4(),
              type: 'error',
              message,
            }),
          );
          return {
            success: false,
          };
        });
    } catch (error) {
      console.log('Error:', error);
      reduxDispatch(
        alertSlice.actions.setAlert({
          id: uuidv4(),
          type: 'error',
          message: `We are having trouble resending a code as of the moment`,
        }),
      );
      return {
        success: false,
      };
    }
  };

  const resetPassword = async (email, code, newPass) => {
    const username = email;
    if (!username) {
      reduxDispatch(
        alertSlice.actions.setAlert({
          id: uuidv4(),
          type: 'error',
          message: `No email is provided`,
          timeout: 3000,
        }),
      );
      return {
        success: false,
      };
    }

    try {
      return await Auth.forgotPasswordSubmit(username, String(code), newPass)
        .then(async (data) => {
          reduxDispatch(
            alertSlice.actions.setAlert({
              id: uuidv4(),
              type: 'success',
              message: `We have successfully changed your password! please login`,
              timeout: 8000,
            }),
          );

          return {
            success: true,
          };
        })
        .catch((err) => {
          let message = err?.message || `We are having trouble changing your password as of the moment`;
          if (Object.values(err).includes('UserNotFoundException')) {
            message = 'User is not found';
          } else if (Object.values(err).includes('InvalidParameterException')) {
            message = 'User is not verified! Please verify the email first';
          }
          reduxDispatch(
            alertSlice.actions.setAlert({
              id: uuidv4(),
              type: 'error',
              message,
            }),
          );
          return {
            success: false,
          };
        });
    } catch (error) {
      console.log('Error:', error);
      reduxDispatch(
        alertSlice.actions.setAlert({
          id: uuidv4(),
          type: 'error',
          message: `We are having trouble changing your password as of the moment`,
        }),
      );
      return {
        success: false,
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'cognito',
        user: {
          displayName: state?.user?.name,
          role: 'admin',
          ...state.user,
        },
        login,
        register,
        resendConfirmation,
        verify,
        logout,
        forgotPasswordSendEmail,
        resetPassword,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
