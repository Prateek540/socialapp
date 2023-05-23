export const LoginSuccess = (jwtToken, currentUser) => ({
  type: "LOGIN_SUCCESS",
  payload: { jwtToken, currentUser },
});

export const LoginFailure = () => ({
  type: "LOGIN_FAILURE",
});

export const LogoutSuccess = () => ({
  type: "LOGOUT_SUCCESS",
});
