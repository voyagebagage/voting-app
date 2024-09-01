"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    window.onTelegramAuth = function (user: TelegramUser) {
      console.log("Logged in as ", user);

      fetch("/api/auth/telegram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.token) {
            localStorage.setItem("token", data.token);
            router.push("/");
          }
        })
        .catch((error) => console.error("Error:", error));
    };
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl mb-4">Login with Telegram</h1>
      <script
        async
        src="https://telegram.org/js/telegram-widget.js?22"
        data-telegram-login="voting_app_kp_bot"
        data-size="large"
        data-onauth="onTelegramAuth(user)"
        data-request-access="write"></script>
      {/* <script type="text/javascript">
  function onTelegramAuth(user) {
    alert('Logged in as ' + user.first_name + ' ' + user.last_name + ' (' + user.id + (user.username ? ', @' + user.username : '') + ')');
  }
</script> */}
      <div
        id={`telegram-login-${process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME}`}
        data-auth-url={`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/telegram`}
        data-request-access="write"></div>
    </div>
  );
}
