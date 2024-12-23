"use client";
import { fetchEventList } from "@/app/action/event";
import { useAuth } from "@/context/AuthContext";
import { Alertsuccess, Alertwarning, FormatDateJsonPro } from "@/utils";
import React from "react";
import useSWR from "swr";
import Link from "next/link";
import Image from "next/image";

// Fetch function for events
const fetcher = (params: object) => fetchEventList(params);

const BlogDetail = ({ params }: { params: { id: number } }) => {
  const { id } = params;
  const { user } = useAuth();
  const { data: Event, mutate } = useSWR(
    { EventId: id, UserId: user?.UserId },
    fetcher
  );
  console.log(id)

  // Handle event registration
  const handleRegisterEvent = async (item) => {
    try {
      const pr = {
        EventId: id,
        StudentId: user?.UserId,
        AttendanceStatus: 0,
      };
      const res = await EV_spEventStudent_Register(pr);
      if (res?.Status == "OK") {
        Alertsuccess(res?.ReturnMess);
      } else {
        Alertwarning(res?.ReturnMess);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Loading state
  if (!Event) return <p>Loading...</p>;

  return (
    <div className="py-8 px-4 flex flex-col md:flex-row gap-8">
      {/* Main Content */}
      <div className="flex-1 md:pr-8 shadow-xl p-3">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">{Event[0]?.EventName}</h1>
        <div className="flex items-center text-sm text-gray-500 mb-6 gap-2">
          <span className="text-sky-500 font-semibold">Đăng bởi: {Event[0]?.CreaterName}</span>
          <span className="mx-2">|</span>
          <span>Ngày bắt đầu: {FormatDateJsonPro(Event[0]?.StartTime, 7)}</span>
          {
              (Event[0]?.IsRegister == 1 || Event[0]?.IsRegister == null) &&
              user?.RoleTmp == "student" && (
                <button
              onClick={() => handleRegisterEvent(Event[0])}
              className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Đăng ký
            </button>
              )}
         
        </div>
        <div
          className="prose prose-lg max-w-none mb-8 text-gray-700"
          dangerouslySetInnerHTML={{ __html: Event[0]?.EventDescription }}
        />
      </div>

      {/* Sidebar with other events */}
      <div className="w-full md:w-1/3">
        <div className="bg-white p-4 shadow-lg rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Các sự kiện khác</h3>
          <div className="space-y-4">
            {Event && Event.slice(0, 5).map((event, index) => (
              <Link key={index} href={`/blog/${event.EventId}`}>
                <div className="flex items-center border-b py-2">
                  <Image
                    src={event.Thumnail || "/avatar.png"}
                    alt="Event Thumbnail"
                    width={50}
                    height={50}
                    className="rounded"
                  />
                  <div className="ml-4">
                    <h4 className="text-sm font-semibold text-gray-800">{event.EventName}</h4>
                    <span className="text-xs text-gray-500">{FormatDateJsonPro(event.StartTime, 7)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
