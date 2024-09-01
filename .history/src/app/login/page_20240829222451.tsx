import { useEffect } from "react";
import Script from "next/script";

export default function LoginPage() {
  useEffect(() => {
    window.Telegram.WebApp.onEvent("mainButtonClicked", () => {
      const userData = window.Telegram.WebApp.initDataUnsafe;
      localStorage.setItem("userData", JSON.stringify(userData));
      window.Telegram.WebApp.close();
    });

    if (window.Telegram) {
      window.Telegram.WebApp.ready();
    }
  }, []);

  return (
    <div>
      <Script
        src="https://telegram.org/js/telegram-webapp.js"
        strategy="afterInteractive"
        onLoad={() => {
          window.Telegram && window.Telegram.WebApp.ready();
        }}
      />
      <h1>Login with Telegram</h1>
    </div>
  );
}
