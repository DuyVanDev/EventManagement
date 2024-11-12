"use client";
import { fetchLocaitonList } from "@/app/action/location";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role, subjectsData } from "@/lib/data";
import Image from "next/image";
import useSWR from "swr";


type Subject = {
  LocationId: number;
  LocationName: string;
  Address: string;
  Capacity: number;
};

const fetcher = (params: object) => fetchLocaitonList(params);

const columns = [
  {
    header: "Tên địa điểm",
    accessor: "LocationName",
  },
  {
    header: "Địa chỉ",
    accessor: "Address",
  },
  {
    header: "Sức chứa",
    accessor: "Capacity",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const LocationListPage =  () => {
  const { data: ListData, mutate } = useSWR({}, fetcher);
  const renderRow = (item: Subject) => (
    <tr
      key={item.LocationId}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className=" py-4">{item.LocationName}</td>
      <td className=" py-4">{item.Address}</td>
      <td className=" py-4">{item.Capacity}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormModal table="location" type="update" data={item} onActionComplete={() => mutate()} />
              <FormModal table="location" type="delete" id={item.LocationId} onActionComplete={() => mutate()}/>
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
          Danh Sách Địa Điểm
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
                table="location"
                type="create"
                data={{
                  LocationId: 0,
                  LocationName: "",
                  Address: "",
                  Capacity: 0,
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

export default LocationListPage;
