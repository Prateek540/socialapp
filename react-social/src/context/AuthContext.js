import { createContext, useReducer } from "react";
import AuthReducer from "./AuthReducer";

const INITIAL_STATE = {
  isAuthenticated:
    localStorage.getItem("isAuthenticated") === null
      ? false
      : localStorage.getItem("isAuthenticated"),
  jwtToken:
    localStorage.getItem("jwtToken") === null
      ? ""
      : localStorage.getItem("jwtToken"),
  currentUser:
    JSON.parse(localStorage.getItem("currentUser")) === null
      ? {}
      : JSON.parse(localStorage.getItem("currentUser")),
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: state.isAuthenticated,
        jwtToken: state.jwtToken,
        currentUser: state.currentUser,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
