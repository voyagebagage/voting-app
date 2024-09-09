"use client";
// src/components/StartupPopup.tsx
import { useEffect, useRef } from "react";
import WebApp from "@/app/lib/twa-sdk";

const StartupPopup = () => {
  const popupShownRef = useRef(false);

  useEffect(() => {
    const showStartupPopup = () => {
      if (typeof WebApp.showPopup === "function" && !popupShownRef.current) {
        try {
          WebApp.showPopup({
            title: "Welcome!",
            message: "Thank you for using our Telegram Web App.",
            buttons: [{ text: "OK", type: "alert" }],
          });
          popupShownRef.current = true;
        } catch (error) {
          console.error("Error showing popup:", error);
          // Optionally implement fallback UI here
        }
      }
    };

    const handleWebAppReady = () => {
      if (WebApp.isVersionAtLeast("6.2")) {
        showStartupPopup();
      } else {
        WebApp.onEvent("viewportChanged", showStartupPopup);
      }
    };

    if (WebApp) {
      WebApp.ready();
      handleWebAppReady();
    }

    return () => {
      if (!WebApp.isVersionAtLeast("6.2")) {
        WebApp.offEvent("viewportChanged", showStartupPopup);
      }
    };
  }, []);

  return null;
};

export default StartupPopup;
