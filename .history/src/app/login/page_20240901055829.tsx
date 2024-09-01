// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { TelegramUser } from "@/types";

// interface LoginProps {
//   onLogin: (user: TelegramUser) => void;
// }

// export default function Login({ onLogin }: LoginProps) {
//   //   console.log("ONLOG " + typeof onLogin);

//   const router = useRouter();
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     console.log("Login component mounted");
//     // console.log("onLogin is a function:", typeof onLogin === "function");
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
//           .then((data) => {
//             if (data.token) {
//               localStorage.setItem("token", data.token);
//               const userParams = new URLSearchParams(initData).get("user");
//               console.log("User PARAMS:", userParams);

//               if (userParams) {
//                 const user: TelegramUser = JSON.parse(userParams);
//                 // console.log("User data: LOGIN", user);

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
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { TelegramUser } from "@/types";

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const [debugInfo, setDebugInfo] = useState<string>("");
  const [loginUrl, setLoginUrl] = useState<string | null>(null);

  useEffect(() => {
    let info = "Debugging Information:\n";

    if (typeof window !== "undefined") {
      info += "Window object is available.\n";

      if (window.Telegram?.WebApp) {
        info += "Telegram WebApp is available.\n";
        const webApp = window.Telegram.WebApp;

        info += `initData: ${webApp.initData}\n`;
        info += `initDataUnsafe: ${JSON.stringify(
          webApp.initDataUnsafe,
          null,
          2
        )}\n`;

        webApp.ready();

        if (webApp.initDataUnsafe.user) {
          const user = webApp.initDataUnsafe.user as TelegramUser;
          info += `User data: ${JSON.stringify(user, null, 2)}\n`;

          fetch("/api/auth/telegram", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ initData: webApp.initData }),
          })
            .then((response) => response.json())
            .then((data) => {
              info += `API response: ${JSON.stringify(data, null, 2)}\n`;
              if (data.success) {
                login(user);
                router.push("/");
              } else {
                info += "Authentication failed.\n";
              }
              setDebugInfo(info);
            })
            .catch((error) => {
              info += `Error during authentication: ${error}\n`;
              setDebugInfo(info);
            });
        } else {
          info += "User data is not available in initDataUnsafe.\n";
        }
      } else {
        info += "Telegram WebApp is not available.\n";
        // Generate login URL for regular web browser
        const botName = process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME;
        const appUrl = encodeURIComponent(window.location.origin);
        setLoginUrl(`https://t.me/${botName}?start=${appUrl}`);
      }
    } else {
      info += "Window object is not available (server-side rendering).\n";
    }

    setDebugInfo(info);
  }, [login, router]);

  if (loginUrl) {
    return (
      <div>
        <h1>Login with Telegram</h1>
        <p>Please open this app in Telegram to log in:</p>
        <a href={loginUrl} target="_blank" rel="noopener noreferrer">
          Open in Telegram
        </a>
        <pre>{debugInfo}</pre>
      </div>
    );
  }

  return (
    <div>
      <h1>Authenticating with Telegram...</h1>
      <pre>{debugInfo}</pre>
    </div>
  );
}
