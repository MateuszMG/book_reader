import { notification } from "antd";

export const handleApiError = (message: string) => {
  notification.error({
    message: message,
    description: message,
    duration: 5,
  });
};
