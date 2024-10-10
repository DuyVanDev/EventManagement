import { fetchTeacher } from "@/app/action/user";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role, teachersData } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

type Teacher = {
  UserId: number;
  FullName: string;
  Email?: string;
  Avatar: string;
  PhoneNumber: string;
  FacultyName: string;
  Address: string;
};

const columns = [
  {
    header: "Info",
    accessor: "info",
  },
  {
    header: "Teacher ID",
    accessor: "teacherId",
    className: "hidden md:table-cell",
  },
  {
    header: "Subjects",
    accessor: "FacultyName",
    className: "hidden md:table-cell",
  },
  {
    header: "Phone",
    accessor: "PhoneNumber",
    className: "hidden lg:table-cell",
  },
  {
    header: "Address",
    accessor: "Address",
    className: "hidden lg:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const TeacherListPage = async () => {
  const teacherList = await fetchTeacher({ Id: 0 });
  console.log(teacherList);
  const renderRow = (item: Teacher) => (
    <tr
      key={item.UserId}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <Image
          src={
            item.Avatar ||
            "https://images.pexels.com/photos/2888150/pexels-photo-2888150.jpeg?auto=compress&cs=tinysrgb&w=1200"
          }
          alt=""
          width={40}
          height={40}
          className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.FullName}</h3>
          <p className="text-xs text-gray-500">{item?.Email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.UserId}</td>
      <td className="hidden md:table-cell">{item.FacultyName}</td>
      <td className="hidden md:table-cell">{item.PhoneNumber}</td>
      <td className="hidden md:table-cell">{item.Address}</td>
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
            <FormModal table="teacher" type="delete" id={item.UserId} />
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
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
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
                  Avatar : ""
                }}
              />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      {/* <Table columns={columns} renderRow={renderRow} data={teachersData} /> */}
      <Table columns={columns} renderRow={renderRow} data={teacherList} />
      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default TeacherListPage;
