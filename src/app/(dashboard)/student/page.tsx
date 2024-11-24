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
    { EventId: 0, UserId: user?.UserId, EventTypeId: eventTypes.join(",") },
    fetcher
  );

  console.log(ListData)
  
  // Cập nhật eventTypes mỗi khi URL thay đổi
  useEffect(() => {
    const eventtype = searchParams.get("eventtype");
    const parsedTypes = eventtype ? eventtype.split(",") : [];
    setEventTypes(parsedTypes);
  }, [searchParams]);
  console.log(eventTypes.join(",") )
  return (
    <div className="bg-gray-50 text-gray-800 font-sans">
      <div className="mx-auto p-6">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="w-2/3 pr-6">
            <div className="pt-4 space-y-6">
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
