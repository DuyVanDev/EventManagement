"use client";
import { useEffect, useState } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";
import envConfig from "@/config";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { EV_spNotificationQueue_GET } from "@/app/action/notify";
import useSWR from "swr";

const fetcher = (params: object) => EV_spNotificationQueue_GET(params);

const NotificationTest = () => {
  const { user } = useAuth();

  const { data: Data, mutate } = useSWR(
    { Id: 0, UserId: user?.UserId },
    fetcher
  );

  console.log(Data?.count)

  const [message, setMessage] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);
  useEffect(() => {
    if (!user?.UserId) return;

    const hubConnection = new HubConnectionBuilder()
      .withUrl(
        `${envConfig.NEXT_PUBLIC_BASE_SEND_CHAT}/notifications?userId=${user?.UserId}`
      ) // URL của SignalR Hub
      .build();

    hubConnection.on("ReceiveMessage", function (message) {
      console.log("Received message:", message);
      setMessage(message); // Lưu message vào state
      setNotificationCount((prev) => prev + 1); // Tăng số lượng thông báo
      setShowDropdown(true); // Hiển thị dropdown
      mutate()
    });

    // Khởi tạo kết nối
    hubConnection
      .start()
      .then(() => {
        console.log("Connected to SignalR!");
        alert("Connect success");
      })
      .catch((err) => {
        console.error("Error while starting connection: " + err);
        alert("Connect er");
      });

    // Dọn dẹp khi component unmount
    return () => {
      hubConnection
        .stop()
        .catch((err) =>
          console.error("Error while stopping connection: " + err)
        );
    };
  }, [user]);

  useEffect(() => {
    if (showDropdown) {
      const timer = setTimeout(() => {
        setShowDropdown(false); // Tự động đóng sau 10 giây
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [showDropdown]);

  return (
    <div className="relative">
      {/* Icon thông báo */}
      <div
        className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative"
        onClick={() => setShowDropdown((prev) => !prev)} // Toggle dropdown khi click vào icon
      >
        <Image
          src="/announcement.png"
          alt="announcement-icon"
          width={20}
          height={20}
        />
        {/* Số thông báo */}
        <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">
          {Data?.count || 0}
        </div>
      </div>

      {/* Dropdown thông báo */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Thông báo mới</h3>
          <div className="border-t border-gray-200 pt-2">
            <p className="text-sm text-gray-600">{message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationTest;
