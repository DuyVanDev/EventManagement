"use client"
import { fetchFacultyList } from "@/app/action/faculty";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role, subjectsData } from "@/lib/data";
import Image from "next/image";
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
    header: "Actions",
    accessor: "action",
  },
];


const fetcher = (params: object) => fetchFacultyList(params);

const FacultyListPage = () => {
  const { data: ListData, mutate } = useSWR({ FacultyId: '0' }, fetcher);
  console.log(ListData);
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
              <FormModal table="faculty" type="update" data={item} onActionComplete={() => mutate()}/>
              <FormModal table="faculty" type="delete" id={item.FacultyId} onActionComplete={() => mutate()}/>
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
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
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
      <Table columns={columns} renderRow={renderRow} data={ListData} />
      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default FacultyListPage;
