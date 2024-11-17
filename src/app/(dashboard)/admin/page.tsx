"use client";
import { EV_spUserRoleAndGenderCount } from "@/app/action/event";
import { EV_spNotification_Save } from "@/app/action/notify";
import CountChart from "@/components/CountChart";
import EventCalendar from "@/components/EventCalendar";
import NotificationTest from "@/components/NotificationTest";
import UserCard from "@/components/UserCard";
import { useAuth } from "@/context/AuthContext";
import { Alertsuccess, Alertwarning } from "@/utils";
import useSWR from "swr";

const fetcher = (params: object) => EV_spUserRoleAndGenderCount(params);

const AdminPage = () => {
  const { data: Data, mutate } = useSWR({ EventId: "0" }, fetcher);
  console.log(Data);

  const handleClick = async () => {
    debugger
    try {
      const data = {
        NotificationId: 0,
        Title: "1",
        SendFrom: 0,
        SendTo: ["3"],
      };
      const result = await EV_spNotification_Save(data);
      if (result?.Status == "OK") {
        Alertsuccess(result?.ReturnMess);
      } else {
        Alertwarning(result?.ReturnMess);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const { user } = useAuth();
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      <button onClick={handleClick}>a</button>
      <NotificationTest />
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
            <CountChart
              type={"Giảng viên"}
              data={{
                totalMale: Data?.UserCounts?.MaleLecturers,
                totalFeMale: Data?.UserCounts?.FemaleLecturers,
              }}
            />
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
