"use client";

import { useEffect, useCallback } from "react";
import { TelegramUser } from "@/types";

interface LoginProps {
  onLogin: (user: TelegramUser) => void;
}

export default function Login({ onLogin }: LoginProps) {
  console.log("Login component rendered, onLogin type:", typeof onLogin);

  const handleTelegramLogin = useCallback(
    (user: TelegramUser) => {
      console.log("Handling Telegram login:", user);
      if (typeof onLogin === "function") {
        onLogin(user);
      } else {
        console.error("onLogin is not a function:", onLogin);
      }
    },
    [onLogin]
  );

  useEffect(() => {
    console.log("Login component mounted");
    console.log("onLogin is a function:", typeof onLogin === "function");

    if (window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      webApp.ready();
      console.log("Telegram WebApp is available");

      if (webApp.initDataUnsafe.user) {
        console.log("User data:", webApp.initDataUnsafe.user);
        handleTelegramLogin(webApp.initDataUnsafe.user);
      } else {
        console.log("No user data available");
      }
    } else {
      console.log("Telegram WebApp is not available");
    }
  }, [handleTelegramLogin]);

  return <div>Authenticating...</div>;
}
// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { TelegramUser } from "@/types";

// interface LoginProps {
//   onLogin: (user: TelegramUser) => void;
// }

// export default function Login({ onLogin }: LoginProps) {
//   const router = useRouter();
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     console.log("Login component mounted");
//     console.log("onLogin is a function:", typeof onLogin === "function");
//     if (window.Telegram?.WebApp) {
//       const webApp = window.Telegram.WebApp;
//       webApp.ready();

//       const initData = webApp.initData;

//       //   console.log("Init Data:", initData);

//       if (initData) {
//         fetch("/api/auth/telegram", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ initData }),
//         })
//           .then((response) => {
//             if (!response.ok) {
//               throw new Error(`HTTP error! status: ${response.status}`);
//             }
//             return response.json();
//           })
//           .then(async (data) => {
//             if (data.token) {
//               localStorage.setItem("token", data.token);
//               const userParams = new URLSearchParams(initData).get("user");
//               if (userParams) {
//                 const user: TelegramUser = await JSON.parse(userParams);
//                 console.log("User data:", user);

//                 onLogin(user);
//                 router.push("/");
//               } else {
//                 throw new Error("User data not found");
//               }
//             } else {
//               throw new Error("No token received");
//             }
//           })
//           .catch((error) => {
//             console.error("Authentication error:", error);
//             setError(`Failed to authenticate. ${error.message}`);
//           });
//       } else {
//         setError("No init data available. Please open this app from Telegram.");
//       }
//     } else {
//       setError(
//         "Telegram WebApp is not available. Please open this app from Telegram."
//       );
//     }
//   }, [onLogin, router]);

//   if (error) {
//     return <div>{error}</div>;
//   }

//   return <div>Authenticating...</div>;
// }
