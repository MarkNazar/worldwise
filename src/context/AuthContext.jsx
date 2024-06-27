import { createContext, useReducer } from "react";

export const AuthContext = createContext();

const initialState = {
  userCredential: null,
  isAuthenticated: false,
};

const FAKE_USER = {
  name: "Jack",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "user/logged-in":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    case "user/logged-out":
      return { ...state, user: null, isAuthenticated: false };
    default:
      throw new Error("Unknown action type");
  }
};

const AuthProvider = ({ children }) => {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const login = (email, password) => {
    if (email === FAKE_USER.email && password === FAKE_USER.password) {
      dispatch({ type: "user/logged-in", payload: FAKE_USER });
    }
  };

  const logout = () => {
    dispatch({ type: "user/logged-out" });
  };
  return (
    <AuthContext.Provider value={{ login, logout, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
