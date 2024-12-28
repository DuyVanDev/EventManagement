"use client";

import {
  EV_spEventStudent_Save,
  EV_spStudentOfEvent_GET,
} from "@/app/action/event";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import {
  Alerterror,
  Alertsuccess,
  Alertwarning,
  ExportExcel,
  FormatDateJsonPro,
} from "@/utils";
import Image from "next/image";
import { useState } from "react";
import useSWR from "swr";

const fetcher = (params: object) => EV_spStudentOfEvent_GET(params);

const StudentList = ({
  onClose,
  eventId,
  eventName,
}: {
  onClose: () => void;
  eventId: number;
  eventName: string;
}) => {
  //#region ExportExcel

  //#endregion ExportExcel

  const columns = [
    {
      header: "Tên sinh viên",
      accessor: "UserName",
    },
    {
      header: "Khoa/Viện",
      accessor: "FacultyName",
    },
    {
      header: "Email",
      accessor: "Email",
      className: "hidden md:table-cell",
    },
    {
      header: "Số điện thoại",
      accessor: "PhoneNumber",
      className: "hidden md:table-cell ",
    },
    {
      header: "Minh chứng",
      accessor: "ProofImage",
      className: "hidden md:table-cell text-center",
    },

    {
      header: "Thời gian đăng ký",
      accessor: "CreateAt",
    },
    {
      header: "Trạng thái",
      accessor: "Status",
      className: "hidden md:table-cell",
    },
  ];

  const { data: EventList, mutate } = useSWR({ EventId: eventId }, fetcher);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Set number of items per page
  const totalPages = Math.ceil(EventList?.length / itemsPerPage);

  // Get the data for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = Array.isArray(EventList)
    ? EventList?.slice(startIndex, startIndex + itemsPerPage)
    : [];
  const [dataProof, setDataProof] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [isModalViewOpen, setIsModalViewOpen] = useState(false);
  const openModalView = () => setIsModalViewOpen(true);
  const closeModalView = () => {
    setIsModalViewOpen(false);
    setDataProof(null);
  };

  const ExportToExcel = () => {
    if (EventList.length === 0) {
      Alertwarning("Vui lòng lọc dữ liệu để xuất Excel");
      return;
    }
    let dataExcel = EventList?.map((item, index) => {
      return {
        STT: index + 1,
        "Tên sinh viên": item.UserName,
        "Khoa/Viện": item.FacultyName,
        "Số điện thoại": item.PhoneNumber,
        Email: item.Email,
        "Thời gian đăng ký": FormatDateJsonPro(item?.CreateAt, 7),
      };
    });
    ExportExcel(dataExcel, "danhsachnhanvien");
    return;
  };

  const EV_spEventStudent_Save_FC = async (item) => {
    setIsLoading(true);
    try {
      const pr = {
        Id: item?.EventStudentId,
        Status: 1,
      };
      const result = await EV_spEventStudent_Save(pr);
      if (result.Status == "OK") {
        Alertsuccess(result.ReturnMess);
        closeModalView();
        setIsLoading(false);
        mutate();
      } else {
        Alertwarning(result.ReturnMess);
        setIsLoading(false);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderRow = (item: Event) => {
    return (
      <tr
        key={item.UserId}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
      >
        <td className="flex items-center gap-4 p-4">{item.FullName}</td>
        <td>{item.FacultyName}</td>
        <td>{item.Email}</td>

        <td>{item.PhoneNumber}</td>
        <td className="flex items-center justify-center">
          {!item?.ProofImage || item?.ProofImage == "" ? (
            <p className="text-red-500">Chưa có</p>
          ) : (
            <Image
              className="cursor-pointer"
              onClick={() => {
                openModalView();
                setDataProof(item);
              }}
              src={item?.ProofImage}
              width={40}
              height={40}
              alt="Minh chứng"
            />
          )}
        </td>
        <td className="hidden md:table-cell">
          {FormatDateJsonPro(item.CreateAt, 10)}
        </td>
        <td>
          {item?.Status == 1 ? (
            <span className="text-green-500"> Đã duyệt</span>
          ) : (
            <button
              onClick={() => {
                EV_spEventStudent_Save_FC(item);
              }}
              className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${
                isLoading ? "cursor-not-allowed opacity-75" : ""
              }`}
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
                "Duyệt"
              )}
            </button>
          )}
        </td>
      </tr>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg w-[1100px] p-6">
        <div className="border-b-[1px] pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">
              <span className="text-blue-500">
                {eventName} ({EventList?.length || 0})
              </span>
            </h2>
            <button
              className={`flex-1 p-2 bg-green-500 rounded-md text-white w-fit `}
              onClick={() => ExportToExcel()}
            >
              Tải Excel
            </button>
          </div>
          <div
            className="p-2 hover:bg-stone-200  cursor-pointer transition-opacity delay-75"
            onClick={onClose}
          >
            <Image src="/close.png" alt="Close" width={14} height={14} />
          </div>
        </div>

        <Table columns={columns} renderRow={renderRow} data={currentData} />
        {/* PAGINATION */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {isModalViewOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[600px]">
            <h2 className="text-lg font-bold mb-4">
              Minh Chứng - {dataProof.FullName}
              {console.log(dataProof?.ProofImage)}
            </h2>
            <div className="flex items-center justify-center p2">
              {!dataProof?.ProofImage || dataProof?.ProofImage == "" ? (
                <p>Chưa cập nhật</p>
              ) : (
                <Image
                  src={dataProof.ProofImage}
                  width={500}
                  height={500}
                  alt="Hình ảnh minh chứng"
                />
              )}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={closeModalView}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 mr-2"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
