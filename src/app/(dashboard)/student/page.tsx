"use client";
import {
  EV_spEventStudent_Register,
  EV_spEventStudentRegisted_List,
  fetchEventList,
} from "@/app/action/event";
import { useAuth } from "@/context/AuthContext";
import { FormatDateJsonPro } from "@/utils/FormatDateJson";
import { Alertsuccess, Alertwarning } from "@/utils/Notifications";
import Image from "next/image";
import useSWR from "swr";

const fetcher = (params: object) => fetchEventList(params);
const fetcherRegisted = (params: object) =>
  EV_spEventStudentRegisted_List(params);

const StudentPage = () => {
  const { user } = useAuth();

  const { data: ListData, mutate } = useSWR(
    { EventId: "0", UserId: user?.UserId },
    fetcher
  );
  const { data: ListDataRegisted } = useSWR(
    { UserId: user?.UserId },
    fetcherRegisted
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

  const registeredEvents = [
    {
      title: "Jard Gel Serinte",
      thumbnail:
        "https://storage.googleapis.com/a1aa/image/LdRXasBPtdLUMBBQ04SvWLVc6QwlJ4TZU9IyoVs6km34666E.jpg",
      date: "2024-11-02",
    },
    {
      title: "Jarm Handwian Tetiriss",
      thumbnail:
        "https://storage.googleapis.com/a1aa/image/LdRXasBPtdLUMBBQ04SvWLVc6QwlJ4TZU9IyoVs6km34666E.jpg",
      date: "2024-11-10",
    },
    {
      title: "Jand Inseontal Derentis",
      thumbnail:
        "https://storage.googleapis.com/a1aa/image/LdRXasBPtdLUMBBQ04SvWLVc6QwlJ4TZU9IyoVs6km34666E.jpg",
      date: "2024-11-15",
    },
    {
      title: "Jarns Limtagar Serings",
      thumbnail:
        "https://storage.googleapis.com/a1aa/image/LdRXasBPtdLUMBBQ04SvWLVc6QwlJ4TZU9IyoVs6km34666E.jpg",
      date: "2024-11-18",
    },
    {
      title: "Jarngra Fenerer",
      thumbnail:
        "https://storage.googleapis.com/a1aa/image/LdRXasBPtdLUMBBQ04SvWLVc6QwlJ4TZU9IyoVs6km34666E.jpg",
      date: "2024-11-20",
    },
    {
      title: "Mchaibel Sener Serints",
      thumbnail:
        "https://storage.googleapis.com/a1aa/image/LdRXasBPtdLUMBBQ04SvWLVc6QwlJ4TZU9IyoVs6km34666E.jpg",
      date: "2024-11-23",
    },
    {
      title: "Sohenil Series",
      thumbnail:
        "https://storage.googleapis.com/a1aa/image/LdRXasBPtdLUMBBQ04SvWLVc6QwlJ4TZU9IyoVs6km34666E.jpg",
      date: "2024-11-25",
    },
    {
      title: "Erg Werie iigh Sering",
      thumbnail:
        "https://storage.googleapis.com/a1aa/image/LdRXasBPtdLUMBBQ04SvWLVc6QwlJ4TZU9IyoVs6km34666E.jpg",
      date: "2024-11-30",
    },
  ];
  return (
    <div className="p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full">
        <div className="flex w-full ">
          <div className="basis-8/12 p-2">
            <h1 className="text-xl font-bold mb-6">Sự kiện sắp diễn ra</h1>
            {ListData?.map((event, index) => (
              <div className="mb-8" key={index}>
                <h2 className="text-xl font-bold mb-2 flex items-center">
                  <Image
                    src="/avatar.png"
                    alt="avatar"
                    width={36}
                    height={36}
                    className="rounded-full cursor-pointer"
                  />
                  <span className="text-base ml-2">Admin</span>
                </h2>
                <img
                  src={event?.thumbnail}
                  alt={`${event.EventName}`}
                  className="w-full h-auto mb-4 rounded-lg"
                />
                <h2 className="text-lg font-semibold">{event.EventName}</h2>
                <p className="text-gray-500 mb-2">
                  Ngày tổ chức: {FormatDateJsonPro(event.StartTime, 10)} -{" "}
                  {FormatDateJsonPro(event.EndTime, 10)}
                </p>
                <p className="text-gray-700">{event.EventDescription}</p>
                <button
                  onClick={() => {
                    handleRegisterEvent(event);
                  }}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Đăng ký
                </button>
              </div>
            ))}
          </div>
          <div className="basis-4/12 bg-gray-200 p-4 rounded-lg">
            <h2 className="text-lg font-bold mb-4">Sự kiện đã đăng ký</h2>
            <div className="space-y-4">
              {ListDataRegisted.map((event, index) => (
                <div className="flex items-center" key={index}>
                  <img
                    alt={`${event.EventName} thumbnail`}
                    className="w-12 h-12 rounded-full mr-4"
                    src={event.thumbnail}
                    width="50"
                    height="50"
                  />
                  <div>
                    <h3 className="font-semibold text-base">{event.EventName}</h3>
                    <p className="text-gray-500 text-sm">
                      Ngày tổ chức: {FormatDateJsonPro(event.StartTime, 7)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPage;
