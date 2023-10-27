import { csrFetch } from "./utils/csrFetch";
import { Notification } from "@/constants/types";

export const getAllNotification = async (): Promise<Notification[]> => {
  const endpoint = "notifications";
  const response = await csrFetch(endpoint, {
    method: "get",
  });

  return response as Notification[];
};

export const deleteNotification = async (notification_id: number) => {
  const endpoint = `notifications/${notification_id}`;
  await csrFetch(endpoint, {
    method: "delete",
  });
};

export const getNewNotification = async () => {
  const endpoint = "notifications/longpoll/new";
  const response = await csrFetch(endpoint, {
    method: "get",
  });

  return response;
};
