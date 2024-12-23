"use client";
import { useEffect, useRef, useState } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";
import envConfig from "@/config";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { EV_spNotificationQueue_GET } from "@/app/action/notify";
import useSWR from "swr";
import { CalculateTimeAgo, FormatDateJsonPro } from "@/utils";

const fetcher = (params: object) => EV_spNotificationQueue_GET(params);

const NotificationTest = () => {
  const { user } = useAuth();

  const {
    data: Data,
    mutate,
    isLoading,
  } = useSWR({ Id: 0, UserId: user?.UserId }, fetcher);
  console.log(Data)
  const dropdownRef = useRef(null);
  const [message, setMessage] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Kiểm tra nếu click không nằm trong ref
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false); // Ẩn dropdown
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    if (!user?.UserId) return;

    const hubConnection = new HubConnectionBuilder()
      .withUrl(
        `${envConfig.NEXT_PUBLIC_BASE_SEND_CHAT}/notifications?userId=${user?.UserId}`
      ) // URL của SignalR Hub
      .build();

    hubConnection.on("ReceiveMessage", function (message) {
      setMessage(message); // Lưu message vào state
      setShowModal(true); // Hiển thị dropdown
      mutate();
    });

    // Khởi tạo kết nối
    hubConnection
      .start()
      .then(() => {
        console.log("Connected to SignalR!");
      })
      .catch((err) => {
        console.error("Error while starting connection: " + err);
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
    if (showModal) {
      const timer = setTimeout(() => {
        setShowModal(false);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [showModal]);

  return (
    <>
      <div className="relative" ref={dropdownRef}>
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
          <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg p-4 max-h-[600px] overflow-y-auto z-[20]">
            <h3 className="text-lg">Thông báo</h3>
            <div className="flex flex-col divide-y-2 border-t">
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <>
                  {Data?.data?.length > 0 ? (
                    Data?.data?.map((item, index) => (
                      <div
                        key={index}
                        className="pt-2 flex flex-col items-start gap-2"
                      >
                        <p className="text-sm text-black line-clamp-3">
                          {item?.Message} -{" "}
                          <span className="font-semibold">
                            {item?.EventName}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Thời gian bắt đầu:{" "}
                          {FormatDateJsonPro(item?.StartTime, 5)}
                        </p>
                        <p className="text-sm text-sky-600 text-right">
                          {CalculateTimeAgo(item?.CreatedAt)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center mt-2 text-sky-500"></p>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="absolute bottom-4 right-8 mt-2 w-80 bg-white shadow-lg rounded-lg p-4">
          <div className="flex items-center justify-between p-2">
            <h3 className="text-sm font-semibold mb-2">Thông báo mới </h3>
            <div
              className="p-2 hover:bg-stone-200  cursor-pointer transition-opacity delay-75"
              onClick={() => setShowModal(false)}
            >
              <Image src="/close.png" alt="Close" width={14} height={14} />
            </div>
          </div>
          <div className="border-t border-gray-200 pt-2">
            <p className="text-sm text-gray-600">{message}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationTest;
