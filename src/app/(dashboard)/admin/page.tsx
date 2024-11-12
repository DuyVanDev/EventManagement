"use client";
import { EV_spUserRoleAndGenderCount } from "@/app/action/event";
import CountChart from "@/components/CountChart";
import EventCalendar from "@/components/EventCalendar";
import UserCard from "@/components/UserCard";
import { useAuth } from "@/context/AuthContext";
import useSWR from "swr";

const fetcher = (params: object) => EV_spUserRoleAndGenderCount(params);

const AdminPage = () => {
  const { data: Data, mutate } = useSWR({ EventId: "0" }, fetcher);
  console.log(Data);

  const { user } = useAuth();
  console.log(user);
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* USER CARDS */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard
            quantity={Data?.UserCounts?.TotalStudents}
            type="Sinh viên"
          />
          <UserCard
            quantity={Data?.UserCounts?.TotalLecturers}
            type="Giảng viên"
          />
        </div>
        {/* MIDDLE CHARTS */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* COUNT CHART */}
          <div className="w-full  h-[450px]">
            <CountChart
              type={"Sinh viên"}
              data={{
                totalMale: Data?.UserCounts?.MaleStudents,
                totalFeMale: Data?.UserCounts?.FemaleStudents,
              }}
            />
          </div>
          <div className="w-full  h-[450px]">
            <CountChart type={"Giảng viên"} data={{
                totalMale: Data?.UserCounts?.MaleLecturers,
                totalFeMale: Data?.UserCounts?.FemaleLecturers,
              }} />
          </div>
          {/* ATTENDANCE CHART */}
        </div>
        {/* BOTTOM CHART */}
      </div>
      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendar events={Data?.UpcomingEvents} />
        {/* <Announcements/> */}
      </div>
    </div>
  );
};

export default AdminPage;
