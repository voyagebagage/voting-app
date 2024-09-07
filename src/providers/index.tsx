import React, { ReactNode, Suspense } from "react";
import { AuthProvider } from "@/providers/AuthContext";
import { ThemeProvider } from "@/providers/ThemeContext";

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
