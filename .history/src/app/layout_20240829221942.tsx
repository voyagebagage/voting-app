import Head from "next/head";
import { useEffect } from "react";
import Script from "next/script";

export default function RootLayout({ children }) {
  useEffect(() => {
    if (window && window.Telegram) {
      Telegram?.WebApp.ready();
    }
  }, []);

  return (
    <>
      <Head>
        <title>Your App Name</title>
        <Script
          src="https://telegram.org/js/telegram-webapp.js"
          strategy="afterInteractive"
          onLoad={() => {
            if (window.Telegram) {
              Telegram.WebApp.ready();
            }
          }}
        />
      </Head>
      <div>{children}</div>
    </>
  );
}
