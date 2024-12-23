"use client";
import { fetchEventList } from "@/app/action/event";
import BlogItem from "@/components/BlogItem";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/context/AuthContext";
import useSWR from "swr";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const fetcher = (params: object) => fetchEventList(params);

const StudentPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Đồng bộ giá trị ban đầu của eventTypes từ URL
  const [eventTypes, setEventTypes] = useState<string[]>(
    searchParams.get("eventtype")?.split(",") || []
  );

  // Fetch data từ server với eventTypes
  const { data: ListData, mutate } = useSWR(
    { EventId: 0, UserId: user?.UserId, FacultyId: eventTypes.join(",") },
    fetcher
  );

  // Cập nhật eventTypes mỗi khi URL thay đổi
  useEffect(() => {
    const eventtype = searchParams.get("eventtype");
    const parsedTypes = eventtype ? eventtype.split(",") : [];
    setEventTypes(parsedTypes);
  }, [searchParams]);
  return (
    <div className="h-screen bg-cover bg-center">
      <div className="">
        <div className="flex gap-6 flex-col md:flex-row p-2">
          {/* Main Content */}
          <div className="w-full md:w-2/3  pr-6  p-6 h-full">
            <p className="font-semibold text-xl">Danh sách sự kiện</p>
            <div className="pt-4 space-y-2 ">
              {ListData?.map((article, index) => (
                <BlogItem post={article} key={index} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default StudentPage;
