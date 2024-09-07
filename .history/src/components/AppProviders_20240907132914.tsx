// src/components/AppProviders.tsx
import React, { ReactNode, Suspense } from "react";
import { AuthProvider } from "@/contexts/AuthContext"; // Adjust the import path as needed
import { ThemeProvider } from "@/contexts/ThemeContext";

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
      </ThemeProvider>
    </AuthProvider>
  );
};
