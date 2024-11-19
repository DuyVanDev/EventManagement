"use client";
import {
  EV_spEventStudent_Register,
  EV_spEventStudentRegisted_List,
  fetchEventList,
} from "@/app/action/event";
import { useAuth } from "@/context/AuthContext";
import { FormatDateJsonPro, CalculateTimeAgo } from "@/utils";
import { Alertsuccess, Alertwarning } from "@/utils/Notifications";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";

const topics = [
  "Technology",
  "Money",
  "Business",
  "Productivity",
  "Art",
  "Mindfulness",
  "Yada Yada",
];

const Sidebar = () => (
  <div className="w-1/3 bg-gray-100 p-4 rounded-lg shadow-md">
    <h3 className="text-lg font-semibold mb-4">Các loại sự kiện</h3>
    <div className="flex flex-wrap gap-2">
      {topics.map((topic, index) => (
        <span
          key={index}
          className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-blue-600 transition duration-300"
        >
          {topic}
        </span>
      ))}
    </div>
  </div>
);

const fetcher = (params: object) => fetchEventList(params);
const fetcherRegisted = (params: object) =>
  EV_spEventStudentRegisted_List(params);

const StudentPage = () => {
  const { user } = useAuth();

  const { data: ListData, mutate } = useSWR(
    { EventId: 0, UserId: user?.UserId },
    fetcher
  );

  const handleRegisterEvent = async (item) => {
    try {
      const pr = {
        EventId: item?.EventId,
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

  return (
    <div className="bg-gray-50 text-gray-800 font-sans">
      <div className="mx-auto p-6">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="w-2/3 pr-6">
            <div className="pt-4 space-y-6">
              {ListData?.map((article, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-2xl transition duration-300"
                >
                  <Link href={`/blog/${article?.EventId}`} className="flex">
                    <div className="flex flex-col w-4/5 space-y-4">
                      <div className="flex items-center mb-2">
                        <img
                          src="/avatar.png"
                          alt="Profile"
                          className="rounded-full mr-2"
                          width="30"
                          height="30"
                        />
                        <span className="text-gray-600">
                          Admin ·{" "}
                          <span className="text-sm bg-gray-200 rounded-md p-2">
                            {CalculateTimeAgo(article.CreateDate)}
                          </span>
                        </span>
                      </div>
                      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                        {article.EventName}
                      </h2>
                      <div className="text-gray-600 text-sm line-clamp-3">
                        <div
                          className="font-normal text-inherit"
                          dangerouslySetInnerHTML={{
                            __html: article.EventDescription,
                          }}
                        ></div>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <div className="text-sm mr-2">
                          Ngày tổ chức: {FormatDateJsonPro(article.StartTime, 7)}
                        </div>
                        {!article?.IsRegister && article?.IsRegister != 0 && (
                          <button
                            onClick={() => handleRegisterEvent(article)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                          >
                            Đăng ký
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="w-1/3 pl-4">
                      <Image
                        src={article.Thumnail}
                        alt="Article"
                        className="rounded-lg"
                        width={200}
                        height={150}
                      />
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default StudentPage;
