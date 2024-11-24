"use client";

import { EV_spStudentOfEvent_GET } from "@/app/action/event";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import { FormatDateJsonPro } from "@/utils";
import Image from "next/image";
import { useState } from "react";
import useSWR from "swr";

const fetcher = (params: object) => EV_spStudentOfEvent_GET(params);

const StudentList = ({
  onClose,
  eventId,
}: {
  onClose: () => void;
  eventId: number;
}) => {
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
      header: "PhoneNumber",
      accessor: "PhoneNumber",
      className: "hidden md:table-cell",
    },
    {
      header: "Thời gian đăng ký",
      accessor: "CreateAt",
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

  const renderRow = (item: Event) => {
    return (
      <tr
        key={item.UserId}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
      >
        <td className="flex items-center gap-4 p-4">{item.UserName}</td>
        <td>{item.FacultyName}</td>
        <td>{item.Email}</td>

        <td>{item.PhoneNumber}</td>
        <td className="hidden md:table-cell">
          {FormatDateJsonPro(item.CreateAt, 10)}
        </td>
      </tr>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg w-[1000px] p-6">
        <div className="border-b-[1px] pb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              Danh sách sinh viên đăng ký
            </h2>
          </div>
          <div className="p-2 hover:bg-stone-200  cursor-pointer transition-opacity delay-75" onClick={onClose}>
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
    </div>
  );
};

export default StudentList;
