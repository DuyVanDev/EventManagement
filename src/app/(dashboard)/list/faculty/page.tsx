"use client";
import { EV_spFaculty_Delete, fetchFacultyList } from "@/app/action/faculty";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role, subjectsData } from "@/lib/data";
import { Alertsuccess, Alertwarning } from "@/utils";
import Image from "next/image";
import { useEffect, useState } from "react";
import useSWR from "swr";
type Subject = {
  FacultyId: number;
  FacultyName: string;
};

const columns = [
  {
    header: "Tên Khoa - Viện",
    accessor: "FacultyName",
  },
  {
    header: "",
    accessor: "action",
  },
];

const fetcher = (params: object) => fetchFacultyList(params);

const FacultyListPage = () => {
  const { data: ListData, mutate } = useSWR({ FacultyId: "0" }, fetcher);

  const [facultyTmp, seTfacultyTmp] = useState(ListData);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Set number of items per page
  const totalPages = Math.ceil(facultyTmp?.length / itemsPerPage);

  // Get the data for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const [querySearch, setQuerySearch] = useState("");

  const currentData =
    Array.isArray(facultyTmp) &&
    facultyTmp?.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    const newList =
      Array.isArray(ListData) &&
      ListData?.filter((item) =>
        item?.FacultyName?.toLowerCase()?.includes(querySearch.toLowerCase())
      );
    seTfacultyTmp(newList);
  }, [querySearch]);
  const handleDelete = async (facultyId: number) => {
    try {
      const result = await EV_spFaculty_Delete({ FacultyId: facultyId });
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
  const renderRow = (item: Subject) => (
    <tr
      key={item.FacultyId}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.FacultyName}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormModal
                table="faculty"
                type="update"
                data={item}
                onActionComplete={() => mutate()}
              />
              <FormModal
                table="faculty"
                type="delete"
                id={item.FacultyId}
                onActionComplete={() => mutate()}
                onActionDelete={handleDelete}
              />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          Danh Sách Khoa - Viện
        </h1>
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
                table="faculty"
                type="create"
                data={{
                  FacultyId: 0,
                  FacultyName: "",
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

export default FacultyListPage;
