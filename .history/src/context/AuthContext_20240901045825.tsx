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
    setUser(userData);
    // Set a cookie here instead of using localStorage
    document.cookie = `user=${JSON.stringify(
      userData
    )}; path=/; max-age=86400; secure; samesite=strict`;
  };

  const logout = () => {
    setUser(null);
    // Remove the cookie
    document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  };

  useEffect(() => {
    // Check for existing user cookie on mount
    const userCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user="));
    if (userCookie) {
      const userData = JSON.parse(userCookie.split("=")[1]);
      setUser(userData);
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
