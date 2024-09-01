import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Login from "./login/page";
import { verifyTokenAndGetUser } from "./lib/auth";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      verifyTokenAndGetUser(token)
        .then((userData) => {
          setUser(userData);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
      router.push("/login");
    }
  }, [router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div>
      Welcome, {user.first_name}!{/* Additional user-specific content */}
    </div>
  );
}
