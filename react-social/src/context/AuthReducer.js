const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        isAuthenticated: true,
        jwtToken: action.payload.jwtToken,
        currentUser: action.payload.currentUser,
      };
    case "LOGIN_FAILURE":
      return {
        isAuthenticated: false,
        jwtToken: "",
        currentUser: {},
      };
    case "LOGOUT_SUCCESS":
      return {
        isAuthenticated: false,
        jwtToken: "",
        currentUser: {},
      };
    default:
      return state;
  }
};

export default AuthReducer;
