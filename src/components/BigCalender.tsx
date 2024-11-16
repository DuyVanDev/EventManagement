"use client";

import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react";
import "moment/locale/vi";
import { fetchEventByTeacher } from "@/app/action/event";
moment.locale("vi");
const localizer = momentLocalizer(moment);

const transformApiData = (event) => {
  const [startDate, startTime] = event.StartTime.split(" ");
  const [startDay, startMonth, startYear] = startDate.split("/");
  const [startHour, startMinute] = startTime.split(":");

  const [endDate, endTime] = event.EndTime.split(" ");
  const [endDay, endMonth, endYear] = endDate.split("/");
  const [endHour, endMinute] = endTime.split(":");

  return {
    title: event.EventName,
    allDay: false, // Hoặc true nếu sự kiện diễn ra cả ngày
    start: new Date(
      parseInt(startYear),
      parseInt(startMonth) - 1,
      parseInt(startDay),
      parseInt(startHour),
      parseInt(startMinute)
    ),
    end: new Date(
      parseInt(endYear),
      parseInt(endMonth) - 1,
      parseInt(endDay),
      parseInt(endHour),
      parseInt(endMinute)
    ),
  };
};

const BigCalendar = ({ teacherId }: { teacherId: number }) => {
  const [view, setView] = useState<View>(Views.WORK_WEEK);
  const [LstData, setLstData] = useState([]);


  const EV_spEventByTeacher_List = async () => {
    const result = await fetchEventByTeacher({ UserId: teacherId });
    // Giả sử result là dữ liệu bạn nhận được từ API
    console.log(result)
    const transformedEvents = result.map(transformApiData);
    setLstData(transformedEvents);
  };
  console.log(LstData)

  useEffect(() => {
    EV_spEventByTeacher_List();
  }, []);
 
  const handleOnChangeView = (selectedView: View) => {
    setView(selectedView);
  };
  
  return (
    <Calendar
      localizer={localizer}
      events={LstData}
      startAccessor="start"
      endAccessor="end"
      views={["work_week", "day"]}
      view={view}
      style={{ height: "98%" }}
      onView={handleOnChangeView}
      min={new Date(2024, 1, 0, 8, 0, 0)}
      max={new Date(2024, 1, 0, 17, 0, 0)}
    />
  );
};

export default BigCalendar;
