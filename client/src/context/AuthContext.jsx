import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { login as loginApi, register as registerApi, fetchMe } from "../api/authService.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("luxestride_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("luxestride_token");
    if (!token) {
      setLoading(false);
      return;
    }
    fetchMe()
      .then(({ user }) => {
        setUser(user);
        localStorage.setItem("luxestride_user", JSON.stringify(user));
      })
      .catch(() => {
        localStorage.removeItem("luxestride_token");
        localStorage.removeItem("luxestride_user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const persistSession = (data) => {
    localStorage.setItem("luxestride_token", data.token);
    localStorage.setItem("luxestride_user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const login = useCallback(async (credentials) => {
    const data = await loginApi(credentials);
    persistSession(data);
    return data.user;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await registerApi(payload);
    persistSession(data);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("luxestride_token");
    localStorage.removeItem("luxestride_user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        loading,
        login,
        register,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
