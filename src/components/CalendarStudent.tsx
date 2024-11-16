"use client";
import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react";
import "moment/locale/vi";
import { fetchEventByTeacher } from "@/app/action/event";
import { FormatDateJsonPro } from "@/utils";
import Image from "next/image";
moment.locale("vi");
const localizer = momentLocalizer(moment);

const CalendarStudent = ({ Data }: { Data: any }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [view, setView] = useState<View>(Views.WORK_WEEK);
  const handleOnChangeView = (selectedView: View) => {
    setView(selectedView);
  };

  const handleSelectEvent = (event) => {
    console.log("Thông tin sự kiện:", event); // Kiểm tra object đầy đủ
    setSelectedEvent(event);
  };
  return (
    <>
      <Calendar
        localizer={localizer}
        events={Data}
        startAccessor="start"
        endAccessor="end"
        views={["work_week", "day"]}
        view={view}
        style={{ height: "98%" }}
        onView={handleOnChangeView}
        onSelectEvent={handleSelectEvent}
        min={new Date(2024, 1, 0, 8, 0, 0)}
        max={new Date(2024, 1, 0, 17, 0, 0)}
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
                  <span className="ml-2 text-sky-600">{selectedEvent.locationName}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">Số lượng tham gia: </span>
                  <span className="ml-2">{selectedEvent.studentJoin}</span>
                </div>
              </div>
              <button
                type="submit"
                className="self-end bg-red-700 text-white py-2 px-4 rounded-md border-none w-max text-sm"
              >
                Hủy đăng ký
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CalendarStudent;
