'use client'
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";

const Menu = () => {
  const { login,user } = useAuth();
  const menuItems = [
    {
      title: "LỐI TẮT",
      items: [
        {
          icon: "/home.png",
          label: "Trang chủ",
          href: `/${user?.RoleTmp}`,
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: "/teacher.png",
          label: "Giảng Viên",
          href: "/list/teachers",
          visible: ["admin"],
        },
        {
          icon: "/student.png",
          label: "Sinh Viên",
          href: "/list/students",
          visible: ["admin"],
        },
        {
          icon: "/parent.png",
          label: "Địa điểm",
          href: "/list/location",
          visible: ["admin"],
        },
        {
          icon: "/calendar.png",
          label: "Khoa - Viện",
          href: "/list/faculty",
          visible: ["admin"],
        },
        {
          icon: "/calendar.png",
          label: "Sự kiện",
          href: "/list/events",
          visible: ["admin"],
        },
        {
          icon: "/exam.png",
          label: "Loại sự kiện",
          href: "/list/eventtype",
          visible: ["admin"],
        },
        {
          icon: "/exam.png",
          label: "Sự kiện tham gia",
          href: "/myevent",
          visible: ["student"],
        },
        {
          icon: "/exam.png",
          label: "Điểm rèn luyện",
          href: "/training-point",
          visible: ["student"],
        },
      ],
    },
  ];
  return (
    <div className="mt-4 text-sm">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2" key={i.title}>
          <span className="hidden lg:block text-white font-light my-4">
            {i.title}
          </span>
          {i.items.map((item) => {
            if (item.visible.includes(user?.RoleTmp)) {
              return (
                <Link
                  href={item.href}
                  key={item.label}
                  className="flex items-center justify-center lg:justify-start gap-4 text-white py-2 md:px-2 rounded-md hover:bg-lamaSkyLight hover:text-black"
                >
                  <Image src={item.icon} alt="" width={20} height={20} className="bg-white rounded-md p-1 " />
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              );
            }
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
