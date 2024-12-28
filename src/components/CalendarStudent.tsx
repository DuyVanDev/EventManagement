"use client";
import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";
import "moment/locale/vi";
import { Alertsuccess, Alertwarning, FormatDateJsonPro } from "@/utils";
import Image from "next/image";
import { EV_spEventStudent_Register } from "@/app/action/event";
import { useAuth } from "@/context/AuthContext";
moment.locale("vi");
const localizer = momentLocalizer(moment);

const CalendarStudent = ({ Data,mutate }: { Data: any,mutate : any }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date()); // Ngày hiện tại
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [view, setView] = useState<View>(Views.WEEK);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  const handleCancelEvent = async (item) => {
    setIsLoading(true);
    try {
      const pr = {
        EventId: item?.eventId,
        StudentId: user?.UserId,
        AttendanceStatus : 1
      };
      const res = await EV_spEventStudent_Register(pr);
      if (res?.Status == "OK") {
        Alertsuccess(res?.ReturnMess);
        setSelectedEvent(null);
        setIsLoading(false);
        mutate()
      } else {
        Alertwarning(res?.ReturnMess);
        setIsLoading(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Calendar
        localizer={localizer}
        events={Data}
        startAccessor="start"
        endAccessor="end"
        step={60}
        date={currentDate}
        onNavigate={(date) => setCurrentDate(date)}
        defaultView={view}
        onSelectEvent={handleSelectEvent}
        view={view}
        onView={(newView) => {
          setView(newView);
        }}
        components={{
          toolbar: CustomToolbar,
          week: {
            header: ({ date, localizer }) => localizer.format(date, "dddd"),
          },
        }}
        style={{ height: "80vh" }}
      />
      {selectedEvent && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-500 bg-opacity-75"
          id="exampleModal"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div
            className="bg-white rounded-lg shadow-lg w-full max-w-lg relative"
            role="document"
          >
            <div
              className="p-2 text-danger cursor-pointer absolute top-4 right-2 btn-cursor"
              onClick={() => {
                setSelectedEvent(null);
              }}
            >
              <Image src="/close.png" alt="Close" width={14} height={14} />
            </div>
            <div className="border-b border-gray-200 p-4">
              <div className="flex flex-col space-y-2">
                <h6 className="text-lg font-semibold uppercase">
                  Thông tin sự kiện
                </h6>
              </div>
            </div>
            <div className="p-4 flex justify-between">
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="font-medium">Tên sự kiện :</span>
                  <span className="ml-2 bg-purple-200 text-purple-800 px-2 py-1 rounded text-sm">
                    {selectedEvent.title}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">Ngày bắt đầu: </span>
                  <span className="ml-2">
                    {FormatDateJsonPro(selectedEvent.start, 5)}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">Ngày kết thúc: </span>
                  <span className="ml-2">
                    {FormatDateJsonPro(selectedEvent.end, 5)}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">Địa điểm: </span>
                  <span className="ml-2 text-sky-600">
                    {selectedEvent.locationName}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">Số lượng tham gia: </span>
                  <span className="ml-2">{selectedEvent.studentJoin}</span>
                </div>
              </div>

              <button
                className={`self-end bg-red-700 text-white py-2 px-4 rounded-md border-none w-max text-sm ${
                  isLoading ? "cursor-not-allowed opacity-75" : ""
                }`}
                type="submit"
                onClick={() => handleCancelEvent(selectedEvent)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                ) : (
                  "Hủy đăng ký"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const CustomToolbar = ({ label, onNavigate, onView }: any) => {
  return (
    <div className="flex justify-between items-center p-4 bg-gray-100 border-b">
      {/* Nút điều hướng */}
      <div className="flex items-center space-x-2">
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded"
          onClick={() => onNavigate("PREV")}
        >
          Trước
        </button>
        <span className="font-bold text-lg">{label}</span>
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded"
          onClick={() => onNavigate("NEXT")}
        >
          Sau
        </button>
      </div>

      {/* Chọn chế độ xem */}
      <div className="flex space-x-2">
        <button
          className="bg-green-500 text-white px-3 py-1 rounded"
          onClick={() => onView("month")}
        >
          Tháng
        </button>
        <button
          className="bg-green-500 text-white px-3 py-1 rounded"
          onClick={() => onView("week")}
        >
          Tuần
        </button>
        <button
          className="bg-green-500 text-white px-3 py-1 rounded"
          onClick={() => onView("day")}
        >
          Ngày
        </button>
      </div>
    </div>
  );
};

export default CalendarStudent;
