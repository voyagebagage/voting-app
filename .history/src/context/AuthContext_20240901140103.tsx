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

  useEffect(() => {
    console.log("AuthProvider useEffect running");
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/verify", {
          credentials: "include",
        });
        console.log("Verify response status:", response.status);
        if (response.ok) {
          const data = await response.json();
          console.log("Verify response data:", data);
          if (data.user) {
            setUser(data.user);
          }
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    };

    checkAuth();
  }, []);
  useEffect(() => {
    console.log("User state updated:", user);
  }, [user]);
  const login = (userData: TelegramUser) => {
    console.log("User data: LOGIN", userData);

    setUser(userData);
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

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
