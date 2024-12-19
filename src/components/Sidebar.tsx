"use client";
import useSWR from "swr";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { EV_spEventType_List, fetchEventType } from "@/app/action/event";
const fetcherEventType = (params: object) => EV_spEventType_List(params);

const Sidebar = () => {
  const [selectedSorts, setSelectedSorts] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams(); // Get the current search params from the URL
  const { data: DataEvent, mutate } = useSWR({ Id: 0 }, fetcherEventType);

  useEffect(() => {
    // On page load, initialize the selectedSorts from the query param
    const initialSorts = searchParams.get("eventtype")?.split(",") || [];
    setSelectedSorts(initialSorts);
  }, [searchParams]);

  const handleFilterChange = (event) => {
    const value = event.target.value;
    let updatedSorts;

    if (selectedSorts.includes(value)) {
      updatedSorts = selectedSorts.filter((sort) => sort !== value); // Uncheck if already checked
    } else {
      updatedSorts = [...selectedSorts, value]; // Add new sort to the list
    }

    setSelectedSorts(updatedSorts);

    // Update the URL with the new `sort` query parameter
    if (updatedSorts.length > 0) {
      router.push(`?eventtype=${updatedSorts.join(",")}`);
    } else {
      // If no selected filters, remove `eventtype` from the URL
      router.push(window.location.pathname);
    }
  };

  return (
    <div className="px-4 h-max sticky top-8 shadow-xl md:w-1/3 py-4 w-full bg-white">
      <h1 className="mt-2 mb-4 text-sm font-medium">Các loại sự kiện</h1>
      <div className="flex flex-col gap-3 text-sm">
        {Array.isArray(DataEvent) &&
          DataEvent?.map((item) => (
            <label
            key={item?.Id}
              htmlFor=""
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                name="eventtype"
                value={`${item?.Id}`}
                checked={selectedSorts.includes(`${item?.Id}`)}
                onChange={handleFilterChange}
                className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 cursor-pointer rounded-sm bg-white checked:bg-blue-800"
              />
              {item?.EventTypeName}
            </label>
          ))}
      </div>
    </div>
  );
};
export default Sidebar;
