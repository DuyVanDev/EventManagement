"use client";

import { FormatDateJsonPro } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

// TEMPORARY

const EventCalendar = ({ events }: { events: any }) => {
  const [value, onChange] = useState<Value>(new Date());

  return (
    <div className="bg-white p-4 rounded-md">
      <Calendar onChange={onChange} value={value} />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold my-4">Sự kiện sắp diễn ra</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <div className="flex flex-col gap-4">
        {events?.length > 0 ? (
          <div>
            {events?.map((event) => (
              <Link href={`/blog/${event?.EventId}`} key={event.EventId}>
                <div className="p-2 rounded-md shadow-lg border-gray-100 ">
                  <div className="flex items-center justify-between">
                    <h1 className="font-semibold text-gray-600">
                      {event.EventName}
                    </h1>
                    <span className="text-gray-300 text-xs">
                      {FormatDateJsonPro(event.StartTime, 7)}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-400 text-sm line-clamp-2">
                    <div
                      className=""
                      dangerouslySetInnerHTML={{
                        __html: event.EventDescription,
                      }}
                    />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center text-sky-500 pt-4">
            Không có sự kiện sắp diễn ra
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCalendar;
