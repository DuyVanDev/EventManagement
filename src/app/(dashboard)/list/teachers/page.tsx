"use client";
import { EV_spTeacher_Delete } from "@/app/action/teacher";
import { fetchTeacher } from "@/app/action/user";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role, teachersData } from "@/lib/data";
import { Alertsuccess, Alertwarning } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";

type Teacher = {
  UserId: number;
  FullName: string;
  Email?: string;
  Avatar: string;
  PhoneNumber: string;
  FacultyName: string;
  Address: string;
};

const fetcher = (params: object) => fetchTeacher(params);
const columns = [
  {
    header: "Avatar",
    accessor: "info",
  },
  {
    header: "Tên giảng viên",
    accessor: "teacherId",
    className: "hidden md:table-cell",
  },
  {
    header: "Khoa/Viện",
    accessor: "FacultyName",
    className: "hidden md:table-cell",
  },
  {
    header: "Số điện thoại",
    accessor: "PhoneNumber",
    className: "hidden lg:table-cell",
  },
  {
    header: "Địa chỉ",
    accessor: "Address",
    className: "hidden lg:table-cell",
  },
  {
    header: "Email",
    accessor: "Email",
    className: "hidden lg:table-cell",
  },
  {
    header: "",
    accessor: "action",
  },
];

const TeacherListPage = () => {
  const { data: ListData, mutate, isLoading } = useSWR({ Id: 0 }, fetcher);
  const [teacherListTmp, seTteacherListTmp] = useState(ListData);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Set number of items per page
  const totalPages = Math.ceil(teacherListTmp?.length / itemsPerPage);

  // Get the data for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData =
    Array.isArray(teacherListTmp) &&
    teacherListTmp?.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    seTteacherListTmp(ListData);
  }, [ListData]);
  const [querySearch, setQuerySearch] = useState("");
  useEffect(() => {
    const newList =
      Array.isArray(ListData) &&
      ListData?.filter((item) =>
        item?.FullName?.toLowerCase()?.includes(querySearch.toLowerCase())
      );
    seTteacherListTmp(newList);
  }, [querySearch]);

  const handleDelete = async (userid: number) => {
    try {
      const result = await EV_spTeacher_Delete({ UserId: userid });
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
  const renderRow = (item: Teacher) => (
    <tr
      key={item.UserId}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <Image
          src={item.Avatar || "/avatar.png"}
          alt=""
          width={40}
          height={40}
          className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
        />
      </td>
      <td className="hidden md:table-cell">{item.FullName}</td>

      <td className="hidden md:table-cell">{item.FacultyName}</td>
      <td className="hidden md:table-cell">{item.PhoneNumber}</td>
      <td className="hidden md:table-cell">{item.Address}</td>
      <td className="hidden md:table-cell">{item?.Email}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/teachers/${item.UserId}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
          </Link>
          {role === "admin" && (
            // <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaPurple">
            //   <Image src="/delete.png" alt="" width={16} height={16} />
            // </button>
            <FormModal
              table="teacher"
              type="delete"
              id={item.UserId}
              onActionDelete={handleDelete}
            />
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Giảng viên</h1>
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
              // <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              //   <Image src="/plus.png" alt="" width={14} height={14} />
              // </button>
              <FormModal
                table="teacher"
                type="create"
                data={{
                  UserId: 0,
                  UserName: "",
                  FullName: "",
                  PhoneNumber: "",
                  Address: "",
                  BirthDay: new Date(),
                  Avatar: "",
                }}
              />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      {/* <Table columns={columns} renderRow={renderRow} data={teachersData} /> */}
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <Table columns={columns} renderRow={renderRow} data={currentData} />
      )}
      {/* PAGINATION */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default TeacherListPage;
