"use client";

import { useAuth } from "@/context/AuthContext";
import Login from "./login/page";
import { useEffect, useState } from "react";
import VotingApp from "@/components/VotingApp";
// import { localStorage } from "localStorage";

export default function Home() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  console.log("User STATE HOME:", user);
  if (typeof window !== "undefined") localStorage.getItem("user");

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      webApp.ready();

      // Set the color scheme
      setTheme(webApp.colorScheme);

      // Listen for theme changes
      webApp.onEvent("themeChanged", () => {
        setTheme(webApp.colorScheme);
      });
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    setLoading(false);
    return <Login />;
  }

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}>
      <h1>Welcome, {user.first_name}!</h1>
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
