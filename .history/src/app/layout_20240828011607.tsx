import { Suspense, ReactNode } from "react";
import Script from "next/script";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://telegram.org/js/telegram-webapp.js"
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
      </body>
    </html>
  );
}
