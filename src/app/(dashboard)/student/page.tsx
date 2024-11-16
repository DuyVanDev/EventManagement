"use client";
import {
  EV_spEventStudent_Register,
  EV_spEventStudentRegisted_List,
  fetchEventList,
} from "@/app/action/event";
import BigCalendar from "@/components/BigCalender";
import { useAuth } from "@/context/AuthContext";
import { FormatDateJsonPro, CalculateTimeAgo } from "@/utils";
import { Alertsuccess, Alertwarning } from "@/utils/Notifications";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
const articles = [
  {
    id: 1,
    author: "Amit Das",
    date: "4 days ago",
    title: "Your portfolio is stopping you from getting that job",
    description:
      "An intense way to learn about the process and practice your designs skills — My 1st hackathon Hackathons have been on my mind since I heard it was a good way to gain experience as a junior UX designer. As my portfolio...",
    category: "Portfolio",
    readTime: "3 min read",
    selectedForYou: true,
    profileImage:
      "https://storage.googleapis.com/a1aa/image/fT9Peyo1rvpnlErldN1mfIStViu9rMySbmYhr0j0nymRT1hnA.jpg",
    articleImage:
      "https://storage.googleapis.com/a1aa/image/be4TXTEPcMSHXqew1Kf8lQucOflHJzQXfmFD2SxfmgjdaqO8E.jpg",
  },
  // Add more articles here as needed
];

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
  <div className="w-1/3">
    <div>
      <h3 className="text-lg font-semibold mb-2">Các loại sự kiện</h3>
      <div className="flex flex-wrap">
        {topics.map((topic, index) => (
          <span
            key={index}
            className="bg-gray-200 px-2 py-1 rounded-full text-sm mr-2 mb-2"
          >
            {topic}
          </span>
        ))}
      </div>
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
  const { data: ListDataRegisted } = useSWR(
    { UserId: user?.UserId },
    fetcherRegisted
  );
  console.log(ListData);

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
    <div className=" text-gray-800 font-sans">
      <div className="container mx-auto p-4">
        <div className="flex">
          {/* Main Content */}
          <div className="w-2/3 pr-8 ">
            <div className=" pt-4 shadow-lg  bg-transparent flex flex-col gap-2">
              {ListData?.map((article, index) => (
                <Link
                  href={`/blog/${article?.EventId}`}
                  className="flex bg-white p-3"
                >
                  <div className="flex flex-col h-full  gap-2 w-4/5">
                    <div className="flex items-center mb-2">
                      <img
                        src="/avatar.png"
                        alt="Profile"
                        className="rounded-full mr-2"
                        width="30"
                        height="30"
                      />
                      <span className="text-gray-600">
                        {`Admin · `}{" "}
                        <span className="text-sm bg-gray-200 rounded-md p-2">
                          {CalculateTimeAgo(article.CreateDate)}
                        </span>
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold mb-2">
                      {article.EventName}
                    </h2>
                    <div className="text-gray-600 mb-2 line-clamp-3 grow">
                      <div
                        className=" !font-normal text-inherit text-sm"
                        dangerouslySetInnerHTML={{
                          __html: article.EventDescription,
                        }}
                      ></div>
                    </div>
                    <div className="flex items-center text-gray-600">
                      {/* <span className="bg-gray-200 px-2 py-1 rounded-full text-sm mr-2">{article.category}</span> */}
                      <div className="text-sm mr-2">
                        Ngày tổ chức: {FormatDateJsonPro(article.StartTime, 7)}
                      </div>
                      {/* {article.selectedForYou && <span className="text-sm mr-2">· Selected for you</span>} */}
                      {!article?.IsRegister && article?.IsRegister != 0 && (
                        <button
                          onClick={() => {
                            handleRegisterEvent(article);
                          }}
                          className=" px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Đăng ký
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="w-1/5">
                    <Image
                      src={article.Thumnail}
                      alt="Article"
                      className="rounded"
                      width={200}
                      height={150}
                    />
                  </div>
                </Link>
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
