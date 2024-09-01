import { Suspense, ReactNode } from "react";
import Script from "next/script";
import Link from "next/link";
import Head from "next/head";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <Head>
        <>
          <title>Voting app</title>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Script
            src="https://telegram.org/js/telegram-webapp.js"
            strategy="beforeInteractive"
          />
        </>
      </Head>
      <body suppressHydrationWarning={true}>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
      </body>
    </html>
  );
}
