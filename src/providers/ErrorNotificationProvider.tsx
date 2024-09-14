"use client";

import { ReactNode, useEffect } from "react";
import { notification } from "antd";

export default function ErrorNotificationProvider({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    // Handle global JS errors
    const handleGlobalError = (event: ErrorEvent) => {
      notification.error({
        message: "Global Error",
        description: event.message || "A global error occurred!",
        duration: 5,
      });
    };

    // Add global error listener for uncaught errors
    window.addEventListener("error", handleGlobalError);

    return () => {
      // Cleanup event listener on unmount
      window.removeEventListener("error", handleGlobalError);
    };
  }, []);

  return <>{children}</>;
}
