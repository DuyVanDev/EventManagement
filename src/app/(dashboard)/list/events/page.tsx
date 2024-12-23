"use client";

import {
  EV_spEvent_ChangeStatus,
  EV_spEvent_Delete,
  fetchEventList,
} from "@/app/action/event";
import { sendNotification } from "@/app/action/sendnotify";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role } from "@/lib/data";
import { Alertsuccess, Alertwarning } from "@/utils";
import { FormatDateJsonPro } from "@/utils/FormatDateJson";
import Image from "next/image";
import { useEffect, useState } from "react";
import useSWR from "swr";
import StudentList from "./studentlist";

type Event = {
  EventId: number;
  EventName: string;
  EventTypeName: string;
  StartTime: string;
  EndTime: string;
  LocationName: string;
};

const ConfirmModal = ({
  event,
  title = "Xác nhận",
  description = "Bạn có chắc thay đổi sự kiện này?",
  onConfirm,
  onCancel,
}: {
  event: any;
  title?: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>

        {/* Description */}
        <p className="text-gray-600 mt-4">
          Bạn có chắc
          {event?.IsRegistrationOpen == 0 ? (
            <span className="text-red-500 font-semibold">
              {" "}
              đóng cập nhật minh chứng{" "}
            </span>
          ) : (
            <span className="text-sky-500 font-semibold">
              {" "}
              mở cập nhật minh chứng{" "}
            </span>
          )}
          sự kiện {event?.EventName}?
        </p>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-4">
          {/* Cancel Button */}
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
          >
            Hủy
          </button>

          {/* Confirm Button */}
          <button
            onClick={() => {
              onConfirm(event);
            }}
            className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};
// Fetch function for SWR
const fetcher = (params: object) => fetchEventList(params);

const columns = [
  {
    header: "Tên sự kiện",
    accessor: "EventName",
  },
  {
    header: "Loại sự kiện",
    accessor: "EventTypeName",
  },
  {
    header: "Thời gian bắt đầu",
    accessor: "StartTime",
    className: "hidden md:table-cell",
  },
  {
    header: "Thời gian Kết thúc",
    accessor: "EndTime",
    className: "hidden md:table-cell",
  },
  {
    header: "Vị trí",
    accessor: "LocationName",
    className: "hidden md:table-cell",
  },
  {
    header: "SV đăng ký",
    accessor: "StudentCount",
    className: "hidden md:table-cell text-center",
  },
  {
    header: "Thông báo",
    accessor: "Notify",
    className: "hidden md:table-cell",
  },
  {
    header: "Mở minh chứng",
    accessor: "Status",
    className: "hidden md:table-cell text-center",
  },
  {
    header: "",
    accessor: "action",
  },
];

const EventListPage = () => {
  const { data: EventList, mutate } = useSWR({ EventId: 0 }, fetcher);
  const [EventListTmp, setEventListTmp] = useState(EventList);
  useEffect(() => {
    setEventListTmp(EventList);
  }, [EventList]);

  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isShowListStudent, setIsShowListStudent] = useState(false);
  const [querySearch, setQuerySearch] = useState("");
  const handleShowListStudent = (eventId: number) => {
    setIsShowListStudent(eventId);
  };

  const handleCloseListStudent = () => {
    setIsShowListStudent(false);
  };

  const handleSendNotification = (eventId: number) => {
    setIsNotificationModalOpen(eventId);
  };

  const handleCloseNotificationModal = () => {
    setIsNotificationModalOpen(false);
  };

  //#region confirm
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleShowConfirm = (eventId: number) => {
    setIsModalOpen(eventId);
  };

  const handleCloseConfirm = () => {
    setIsModalOpen(false);
  };
  const handleConfirm = async (item) => {
    try {
      const pr = {
        EventId: item?.EventId,
        IsRegistrationOpen: item?.IsRegistrationOpen == 1 ? 0 : 1,
      };
      const result = await EV_spEvent_ChangeStatus(pr);
      if (result?.Status == "OK") {
        Alertsuccess(result?.ReturnMess);
        mutate();
        setIsModalOpen(false);
      } else {
        Alertwarning(result?.ReturnMess);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  //#endregion
  const handleDelete = async (eventId: number) => {
    try {
      const result = await EV_spEvent_Delete({ EventId: eventId });
      if (result?.Status == "OK") {
        Alertsuccess(result?.ReturnMess);
        mutate();
      } else {
        Alertwarning(result?.ReturnMess);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const newList = EventList?.filter((item) =>
      item?.EventName.toLowerCase()?.includes(querySearch.toLowerCase())
    );
    setEventListTmp(newList);
  }, [querySearch]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Set number of items per page
  const totalPages = Math.ceil(EventListTmp?.length / itemsPerPage);

  // Get the data for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = Array.isArray(EventListTmp)
    ? EventListTmp?.slice(startIndex, startIndex + itemsPerPage)
    : [];

  const renderRow = (item: any) => {
    return (
      <tr
        key={item.EventId}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
      >
        <td className="flex items-center gap-4 p-4">{item.EventName}</td>
        <td>{item.EventTypeName}</td>
        <td className="hidden md:table-cell">
          {FormatDateJsonPro(item.StartTime, 5)}
        </td>
        <td className="hidden md:table-cell">
          {FormatDateJsonPro(item.EndTime, 5)}
        </td>
        <td>{item.LocationName}</td>
        <td className="flex items-center justify-center">
          <button
            className={`w-8 h-8 flex items-center justify-center rounded-full bg-lamaSky`}
            onClick={() => handleShowListStudent(item.EventId)}
          >
            <Image src={`/view.png`} alt="" width={16} height={16} />
          </button>
        </td>
        <td>
          <button
            onClick={() => handleSendNotification(item.EventId)}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Gửi thông báo
          </button>
        </td>
        <td>
          <div className="flex items-center justify-center  ">
            <button
              onClick={() => handleShowConfirm(item.EventId)}
              className={`w-16 h-8 flex items-center rounded-full p-1 transition
                 ${
                   item?.IsRegistrationOpen == 1 ? "bg-gray-400" : "bg-blue-600"
                 }
              
              `}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
                  item?.IsRegistrationOpen == 0
                    ? "translate-x-8"
                    : "translate-x-0"
                }`}
              ></div>
            </button>
          </div>
        </td>
        <td>
          <div className="flex items-center gap-2">
            {role === "admin" && (
              <>
                <FormModal
                  table="event"
                  type="update"
                  data={item}
                  onActionComplete={() => mutate()}
                />
                <FormModal
                  table="event"
                  type="delete"
                  id={item.EventId}
                  onActionComplete={() => mutate()}
                  onActionDelete={handleDelete}
                />
              </>
            )}
          </div>
        </td>
        {isNotificationModalOpen === item.EventId && (
          <NotificationModal
            onClose={handleCloseNotificationModal}
            event={item}
          />
        )}

        {isShowListStudent === item.EventId && (
          <StudentList
            onClose={handleCloseListStudent}
            eventId={item?.EventId}
            eventName={item?.EventName}
          />
        )}

        {isModalOpen === item.EventId && (
          <ConfirmModal
            event={item}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />
        )}
      </tr>
    );
  };

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Sự kiện</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
            <Image src="/search.png" alt="" width={14} height={14} />
            <input
              type="text"
              value={querySearch}
              onChange={(e) => setQuerySearch(e.target.value)}
              placeholder="Tìm kiếm..."
              className="w-[200px] p-2 bg-transparent outline-none"
            />
          </div>
          <div className="flex items-center gap-4 self-end">
            {role === "admin" && (
              <FormModal
                table="event"
                type="create"
                data={{
                  EventId: 0,
                  EventName: "",
                  EventDescription: "",
                  EventDate: "",
                  Time: null,
                  LocationId: 0,
                  LectureId: "",
                  EventTypeId: 0,
                  ParticipantLimit: 0,
                  Thumnail: "",
                  ListImage: null,
                  Point: 0,
                  FacultyId: 0,
                }}
                onActionComplete={() => mutate()}
              />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={currentData} />
      {/* PAGINATION */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

const NotificationModal = ({
  onClose,
  event,
}: {
  onClose: () => void;
  eventN: any;
}) => {
  const [activeTab, setActiveTab] = useState("students");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const convertToArray = (pr: string) => {
    const convertedArray = pr?.split(";").map(Number); // Tách chuỗi và chuyển thành mảng số
    return convertedArray;
  };

  const handleSend = async (events) => {
    setIsLoading(true);
    try {
      if (activeTab == "lecturers") {
        const a = convertToArray(events?.LecturerId);
        await sendNotification({
          message: message,
          userIds: a,
          eventId: event?.EventId,
        });
        Alertsuccess("Gửi thông báo thành công!");
        setMessage("");
      }

      if (activeTab == "students") {
        const b = convertToArray(events?.StudentIds);
        await sendNotification({
          message: message,
          userIds: b,
          eventId: event?.EventId,
        });
        Alertsuccess("Gửi thông báo thành công!");
        setMessage("");
      }
    } catch (error) {
      console.error("Failed to send notification:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg w-96 p-6">
        <h2 className="text-lg font-semibold mb-4">
          Gửi thông báo cho {event?.EventName}
        </h2>
        <div className="flex mb-4">
          <button
            className={`flex-1 py-2 ${
              activeTab === "students"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setActiveTab("students")}
          >
            Sinh viên
          </button>
          <button
            className={`flex-1 py-2 ${
              activeTab === "lecturers"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setActiveTab("lecturers")}
          >
            Giảng viên
          </button>
        </div>
        <textarea
          className="w-full border border-gray-300 rounded p-2 mb-4"
          rows={4}
          placeholder="Nhập nội dung thông báo..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className={`bg-green-500 text-white px-4 py-2 rounded flex items-center justify-center gap-2 ${
              isLoading ? "cursor-not-allowed opacity-75" : ""
            }`}
            onClick={() => {
              handleSend(event);
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            ) : (
              "Gửi"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventListPage;
