// import { Suspense, ReactNode } from "react";
// import Script from "next/script";
// import Link from "next/link";

// interface RootLayoutProps {
//   children: ReactNode;
// }

// export default function RootLayout({ children }: RootLayoutProps) {
//   return (
//     <html lang="en">
//       <head>
//         <Script
//           src="https://telegram.org/js/telegram-web-app.js"
//           strategy="beforeInteractive"
//         />
//       </head>
//       <body>
//         <nav>
//           <Link href="/">Home</Link>
//           <Link href="/login">Login</Link>
//         </nav>
//         <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
//       </body>
//     </html>
//   );
// }
import "../app/globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
import { AuthProvider } from "@/context/AuthContext";
import Head from "next/head";
import Script from "next/script";
import { Suspense } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <AuthProvider>
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-screen">
                Layout Loading...
              </div>
            }>
            {children}
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}
