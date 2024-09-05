"use client";

import { useAuth } from "@/context/AuthContext";
import Login from "./login/page";
import { useEffect, useState } from "react";
import VotingApp from "@/components/VotingApp";

export default function Home() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  console.log("User STATE HOME:", user);
  if (typeof window !== "undefined") localStorage.getItem("user");

  useEffect(() => {
    console.log("Home component mounted");

    if (window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      webApp.ready();

      // Set the color scheme
      setTheme(webApp.colorScheme);
      // Apply Telegram theme variables
      document.documentElement.style.setProperty(
        "--tg-theme-bg-color",
        webApp.themeParams.bg_color
      );
      document.documentElement.style.setProperty(
        "--tg-theme-text-color",
        webApp.themeParams.text_color
      );
      document.documentElement.style.setProperty(
        "--tg-theme-hint-color",
        webApp.themeParams.hint_color
      );
      document.documentElement.style.setProperty(
        "--tg-theme-link-color",
        webApp.themeParams.link_color
      );
      document.documentElement.style.setProperty(
        "--tg-theme-button-color",
        webApp.themeParams.button_color
      );
      document.documentElement.style.setProperty(
        "--tg-theme-button-text-color",
        webApp.themeParams.button_text_color
      );

      // Listen for theme changes
      webApp.onEvent("themeChanged", () => {
        setTheme(webApp.colorScheme);
      });
    }
    console.log("after webApp");
    console.log("loading B:", loading);
    setLoading(false);
    console.log("loading A:", loading);
  }, []);
  console.log("loading:", loading);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-tg-theme-text-color">
        Please log in to use the app.
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}>
      <header>Welcome, {user.first_name}!</header>
      <div className="max-w-md mx-auto"></div>
      <VotingApp />
    </div>
  );
}

// "use client";

// import { useState, useCallback } from "react";
// import { TelegramUser } from "@/types";
// import Login from "./login/page";

// export default function Home() {
//   const [user, setUser] = useState<TelegramUser | null>(null);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   const handleLogin = useCallback((userData: TelegramUser) => {
//     console.log("handleLogin called with:", userData);
//     setUser(userData);
//     setIsLoggedIn(true);
//   }, []);

//   console.log(
//     "Rendering Home component, user:",
//     user,
//     "isLoggedIn:",
//     isLoggedIn
//   );

//   if (!isLoggedIn) {
//     console.log("Rendering Login component");
//     return <Login onLogin={handleLogin} />;
//   }

//   return (
//     <div>
//       <h1>Welcome, {user?.first_name || "User"}!</h1>
//       {/* Add your app content here */}
//     </div>
//   );
// }
// "use client";

// import Login from "@/app/login/page";
// import { useEffect, useState } from "react";
// // import { useRouter } from "next/navigation";
// import { verifyTokenAndGetUser } from "@/app/lib/auth";
// import { TelegramUser } from "@/types";

// export default function Home() {
//   // const router = useRouter();
//   const [user, setUser] = useState<TelegramUser | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     console.log("Token:", token);

//     if (token) {
//       verifyTokenAndGetUser(token)
//         .then((userData) => {
//           if (userData) {
//             setUser(userData);
//           } else {
//             setError("Failed to get user data");
//           }
//         })
//         .catch((error) => {
//           console.error("Error verifying token:", error);
//           setError("Error verifying token");
//         })
//         .finally(() => {
//           setIsLoading(false);
//         });
//     } else {
//       setIsLoading(false);
//     }
//   }, []);

//   const handleLogin = (user: TelegramUser) => setUser(user);

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   if (!user) {
//     console.log("Rendering Login component with onLogin prop");

//     return <Login onLogin={handleLogin} />;
//   }
//   console.log("User STATE HOME:", user);

//   return (
//     <div>
//       <h1>Welcome, {user?.first_name}!</h1>
//       {/* Your app content */}
//     </div>
//   );
// }
