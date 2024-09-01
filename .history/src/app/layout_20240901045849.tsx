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
import { AuthProvider } from "@/contexts/AuthContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
