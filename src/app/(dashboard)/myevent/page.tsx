"use client";
import {
  EV_spEventStudent_Register,
  EV_spEventStudentRegisted_List,
} from "@/app/action/event";
import BigCalendar from "@/components/BigCalender";
import CalendarStudent from "@/components/CalendarStudent";
import { useAuth } from "@/context/AuthContext";
import { FormatDateJsonPro, CalculateTimeAgo } from "@/utils";
import { Alertsuccess, Alertwarning } from "@/utils/Notifications";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";

const transformApiData = (event) => {
  console.log(event);
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

const fetcherRegisted = (params: object) =>
  EV_spEventStudentRegisted_List(params);

const StudentPage = () => {
  const { user } = useAuth();

  const { data: ListDataRegisted } = useSWR(
    { UserId: user?.UserId },
    fetcherRegisted
  );
  const [LstData, setLstData] = useState([]);

  useEffect(() => {
    const transformedEvents = ListDataRegisted?.map(transformApiData);
    setLstData(transformedEvents);
  }, [ListDataRegisted]);

  console.log(ListDataRegisted);
  return (
    <div className="h-full">
      <div className="container mx-auto p-4 h-full">
        <div className="flex h-full">
          {/* Main Content */}
          <div className="w-2/3 pr-8 ">
            <div className=" pt-4 shadow-lg  bg-transparent gap-2 h-full">
              <p>Lịch</p>
              <CalendarStudent Data={LstData} />
            </div>
          </div>
          {/* Sidebar */}
          <div className="w-1/3 shadow-lg p-3">
            {ListDataRegisted?.map((article, index) => (
              <Link href={`/blog/${article?.EventId}`} className="flex">
                <div className="w-1/5">
                  <Image
                    src={article.Thumnail}
                    alt="Article"
                    className="rounded-md"
                    width={80}
                    height={80}
                  />
                </div>
                <div className="flex flex-col h-full  gap-2 w-4/5">
                  <h2 className="text-base font-semibold ">
                    {article.EventName}
                  </h2>

                  <div className="flex items-center text-gray-600">
                    {/* <span className="bg-gray-200 px-2 py-1 rounded-full text-sm mr-2">{article.category}</span> */}
                    <div className="text-sm mr-2">
                      Ngày tổ chức: {article?.StartTime}
                    </div>
                    {/* {article.selectedForYou && <span className="text-sm mr-2">· Selected for you</span>} */}
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

export default StudentPage;
