"use client";
import React, { createContext, useState, useContext, useEffect } from "react";
import { TelegramUser } from "@/types";

interface AuthContextType {
  user: TelegramUser | null;
  login: (user: TelegramUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<TelegramUser | null>(null);

  const login = (userData: TelegramUser) => {
    console.log("User data: LOGIN", userData);

    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    // Remove the auth_token cookie
    document.cookie =
      "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  };

  useEffect(() => {
    // Check for existing auth_token cookie on mount
    const hasAuthToken = document.cookie
      .split(";")
      .some((item) => item.trim().startsWith("auth_token="));
    if (hasAuthToken) {
      // If we have an auth_token, we consider the user logged in
      // You might want to verify the token with your backend here
      fetch("/api/auth/verify")
        .then((response) => response.json())
        .then((data) => {
          if (data.user) {
            setUser(data.user);
          }
        })
        .catch((error) => console.error("Error verifying token:", error));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
