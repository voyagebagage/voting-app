import { useEffect } from "react";
import { useRouter } from "next/router";
import useTelegramInitData from "../hooks/useTelegramInitData";

export default function Home() {
  const router = useRouter();
  const initData = useTelegramInitData();

  useEffect(() => {
    if (initData.user) {
      // User is authenticated, you can use initData.user here
      console.log("User data:", initData.user);
    } else {
      // Redirect to login if no user data
      router.push("/login");
    }
  }, [initData, router]);

  if (!initData.user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, {initData.user.first_name}!</h1>
      {/* Rest of your app */}
    </div>
  );
}
