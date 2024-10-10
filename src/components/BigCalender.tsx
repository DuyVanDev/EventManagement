"use client";

import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import moment from "moment";
import { calendarEvents } from "@/lib/data";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react";
import "moment/locale/vi";
import { fetchEventByTeacher } from "@/app/action/event";
moment.locale("vi");
const localizer = momentLocalizer(moment);

const BigCalendar = ({ teacherId }: { teacherId: number }) => {
  const [view, setView] = useState<View>(Views.WEEK);
  console.log(teacherId);
  const [LstData, setLstData] = useState([]);
  const EV_spEventByTeacher_List = async () => {
    const result = await fetchEventByTeacher({ UserId: parseInt(teacherId) });
    console.log(result);
    setLstData(result);
  };

  useEffect(() => {
    EV_spEventByTeacher_List();
  }, []);

  // Hàm để chuyển đổi
  const transformEvents = (event: any) => {
    // Chuyển đổi StartTime và EndTime từ định dạng dd/MM/yyyy HH:mm:ss thành các tham số cho new Date()

    // Tách ngày giờ của StartTime
    const [startDate, startTime] = event.StartTime.split(" ");
    const [startDay, startMonth, startYear] = startDate.split("/");
    const [startHour, startMinute] = startTime.split(":");

    // Tách ngày giờ của EndTime
    const [endDate, endTime] = event.EndTime.split(" ");
    const [endDay, endMonth, endYear] = endDate.split("/");
    const [endHour, endMinute] = endTime.split(":");


    return {
      title: event.EventName,
      allDay: false,
      // Chuyển StartTime thành đối tượng Date
      start: new Date(
        parseInt(startYear), // Năm
        parseInt(startMonth) - 1, // Tháng (lưu ý tháng bắt đầu từ 0)
        parseInt(startDay), // Ngày
        parseInt(startHour), // Giờ
        parseInt(startMinute) // Phút
      ),
      // Chuyển EndTime thành đối tượng Date
      end: new Date(
        parseInt(endYear),
        parseInt(endMonth) - 1,
        parseInt(endDay),
        parseInt(endHour),
        parseInt(endMinute)
      ),
    };
  };

  
  const transformedEvents = LstData?.map(transformEvents);

  console.log(transformedEvents);
  const handleOnChangeView = (selectedView: View) => {
    setView(selectedView);
  };

  return (
    <Calendar
      localizer={localizer}
      events={transformedEvents}
      startAccessor="start"
      endAccessor="end"
      views={["week", "day"]}
      view={view}
      style={{ height: "98%" }}
      onView={handleOnChangeView}
      min={new Date(2025, 1, 0, 0, 0, 0)}
      max={new Date(2025, 1, 0, 24, 0, 0)}
      culture="vn"
    />
  );
};

export default BigCalendar;
