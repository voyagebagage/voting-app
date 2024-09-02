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
  const { login, user } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  //   useEffect(() => {
  //     console.log("Login component mounted, user:", user);
  //     if (user) {
  //       console.log("User already logged in, redirecting to home");
  //       router.push("/");
  //     }
  //   }, [user, router]);
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      webApp.ready();
      const initData = webApp.initData;

      console.log("Init Data:", initData);
      if (initData) {
        fetch("/api/auth/telegram", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ initData }),
          credentials: "include",
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            if (data.success && data.user) {
              console.log("Login successful, user data:", data.user);
              login(data.user);
              // history.pushState({}, "", "/");
              router.push("/");
            } else {
              throw new Error("Authentication failed");
            }
          })
          .catch((error) => {
            console.error("Authentication error:", error);
            setError(`Failed to authenticate. ${error.message}`);
          });
      } else {
        setError("No init data available. Please open this app from Telegram.");
      }
    } else {
      setError(
        "Telegram WebApp is not available. Please open this app from Telegram."
      );
    }
  }, [login, router]);

  if (error) {
    return <div>{error}</div>;
  }

  return <div>Authenticating with Telegram...</div>;
}
