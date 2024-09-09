import React, { ReactNode, Suspense } from "react";
import { AuthProvider } from "@/providers/AuthContext";
import { ThemeProvider } from "@/providers/ThemeContext";
import CenteredSpinner from "@/components/ui/CenteredSpinner";

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Suspense fallback={<CenteredSpinner />}>{children}</Suspense>
      </ThemeProvider>
    </AuthProvider>
  );
};
