"use client"
import { useEffect } from "react";
import * as signalR from "@microsoft/signalr";
import envConfig from "@/config";

const Notification = () => {
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${envConfig.NEXT_PUBLIC_BASE_URL}/notificationHub`) // URL của SignalR hub
      .withAutomaticReconnect()
      .build();

    connection.start()
      .then(() => console.log("SignalR Connected"))
      .catch(err => console.error("SignalR Connection Error: ", err));

    connection.on("ReceiveNotification", (message) => {
      console.log("Received notification: ", message);
      alert(message); // Hiển thị thông báo
    });

    return () => {
      connection.stop();
    };
  }, []);

  return null; // Hoặc UI hiển thị thông báo
};

export default Notification;
