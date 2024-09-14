"use client";

import { useEffect } from "react";
import { notification } from "antd";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Show error notification when an error is caught
    notification.error({
      message: "Rendering Error",
      description:
        error.message || "An error occurred while rendering the page.",
      duration: 5,
    });
  }, [error]);

  return (
    <div>
      <h1>Something went wrong!</h1>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
