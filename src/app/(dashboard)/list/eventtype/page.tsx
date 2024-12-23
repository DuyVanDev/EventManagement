"use client";
import { EV_spEventType_Delete, EV_spEventType_List } from "@/app/action/event";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role } from "@/lib/data";
import { Alertsuccess, Alertwarning } from "@/utils";
import Image from "next/image";
import { useEffect, useState } from "react";
import useSWR from "swr";

type Subject = {
  Id: number;
  EventTypeName: string;
};

const fetcher = (params: object) => EV_spEventType_List(params);

const columns = [
  {
    header: "Tên loại sự kiện",
    accessor: "EventTypeName",
  },

  {
    header: "",
    accessor: "action",
  },
];

const EventTypeListPage = () => {
  const { data: ListData, mutate } = useSWR({ Id: 0 }, fetcher);
  const [eventTypeListTmp, setEventTypeListTmp] = useState(ListData);
  const [querySearch, setQuerySearch] = useState("");
  useEffect(() => {
    const newList = ListData?.filter((item) =>
      item?.EventTypeName?.toLowerCase()?.includes(querySearch.toLowerCase())
    );
    setEventTypeListTmp(newList);
  }, [querySearch]);
  useEffect(() => {
    setEventTypeListTmp(ListData);
  }, [ListData]);
  const handleDelete = async (id: number) => {
    try {
      const result = await EV_spEventType_Delete({ Id: id });
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
      key={item.Id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className=" py-4">{item.EventTypeName}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormModal
                table="eventtype"
                type="update"
                data={item}
                onActionComplete={() => mutate()}
              />
              <FormModal
                table="eventtype"
                type="delete"
                id={item.Id}
                onActionComplete={() => mutate()}
                onActionDelete={handleDelete}
              />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Set number of items per page
  const totalPages = Math.ceil(eventTypeListTmp?.length / itemsPerPage);

  // Get the data for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = Array.isArray(eventTypeListTmp)
    ? eventTypeListTmp?.slice(startIndex, startIndex + itemsPerPage)
    : [];

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          Danh Sách Loại Sự Kiện
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
                table="eventtype"
                type="create"
                data={{
                  Id: 0,
                  EventTypeName: "",
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

export default EventTypeListPage;
