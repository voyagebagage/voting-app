"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import WebApp from "@twa-dev/sdk";
import useTelegramTheme from "@/hooks/useTelegramTheme";
import Login from "./login/page";

// import VotingApp from "@/components/VotingApp";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const { bgClass, textClass, buttonBgClass, buttonTextClass } =
    useTelegramTheme();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // console.log(["Home component mounted"]);

    WebApp.ready();
    setIsReady(true);
  }, []);
  console.log(["User STATE HOME:", user]);
  if (!isReady) {
    if (!user) {
      return (
        <div className="text-tg-theme-text-color">
          <Login />
        </div>
      );
    }
    if (!isAuthenticated) {
      return (
        <main className={`min-h-screen p-4 ${bgClass} ${textClass}`}>
          <div className="flex justify-center items-center h-screen">
            auth Page Loading...
          </div>
        </main>
      );
    }
  }
  return (
    <main className={`min-h-screen p-4 ${bgClass} ${textClass}`}>
      <header>Welcome, {user?.first_name}!</header>
      <div className="max-w-md mx-auto"></div>
      {/* <VotingApp /> */}
    </main>
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
