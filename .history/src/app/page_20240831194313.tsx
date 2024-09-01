"use client";

import Login from "@/app/login/page";
import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
import { verifyTokenAndGetUser } from "@/app/lib/auth";
import { TelegramUser } from "@/types";

export default function Home() {
  // const router = useRouter();
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token:", token);

    if (token) {
      verifyTokenAndGetUser(token)
        .then((userData) => {
          if (userData) {
            setUser(userData);
          } else {
            setError("Failed to get user data");
          }
        })
        .catch((error) => {
          console.error("Error verifying token:", error);
          setError("Error verifying token");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleLogin = (user: TelegramUser) => setUser(user);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    console.log("Rendering Login component with onLogin prop");

    return <Login onLogin={handleLogin} />;
  }
  console.log("User STATE HOME:", user);

  return (
    <div>
      <h1>Welcome, {user.first_name}!</h1>
      {/* Your app content */}
    </div>
  );
}
