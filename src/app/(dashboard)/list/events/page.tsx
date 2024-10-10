import { fetchEventList } from "@/app/action/event";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { eventsData, role } from "@/lib/data";
import { FormatDateJsonPro } from "@/utils/FormatDateJson";
import Image from "next/image";

type Event = {
  EventId: number;
  EventName: string;
  EventTypeName: string;
  StartTime: string;
  EndTime: string;
  LocationName : string
};

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
    header: "Actions",
    accessor: "action",
  },
];

const EventListPage = async () => {
  const EventList = await fetchEventList({EventId : '0'})
  console.log(EventList)

  const renderRow = (item: Event) => (
    <tr
      key={item.EventId}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.EventName}</td>
      <td>{item.EventTypeName}</td>
      <td>{item.LocationName}</td>
      <td className="hidden md:table-cell">{FormatDateJsonPro(item.EndTime,5)}</td>
      <td className="hidden md:table-cell">{FormatDateJsonPro(item.EndTime,5)}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormModal table="event" type="update" data={item} />
              <FormModal table="event" type="delete" id={item.EventId} />
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
        <h1 className="hidden md:block text-lg font-semibold">Sự kiện</h1>
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
                }}
              />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={EventList} />
      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default EventListPage;