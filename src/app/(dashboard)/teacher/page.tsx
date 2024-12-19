"use client";
import { fetchEventByTeacher } from "@/app/action/event";
import Announcements from "@/components/Announcements";
import BigCalendar from "@/components/BigCalender";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import useSWR from "swr";
import EventListTeacher from "./eventlist";

const fetcherEventByTeacher = (params: object) => fetchEventByTeacher(params);

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
    locationName: event.LocationName,
    studentJoin: event.StudentCount,
  };
};
const TeacherPage = () => {
  const [Data, setData] = useState([]);
  const { user } = useAuth();
  const { data: ListData } = useSWR(
    { UserId: user?.UserId },
    fetcherEventByTeacher
  );
  useEffect(() => {
    const transformedEvents =
      ListData?.map(transformApiData);
    setData(transformedEvents);
  }, [ListData]);
  console.log(ListData)


  return (
    <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Lịch</h1>
          <BigCalendar Data={Data} />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <EventListTeacher data={ListData} />
      </div>
    </div>
  );
};

export default TeacherPage;
