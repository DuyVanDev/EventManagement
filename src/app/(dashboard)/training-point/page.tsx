"use client";
import { EV_spEventListByStudent_Get } from "@/app/action/event";
import { useAuth } from "@/context/AuthContext";
import { FormatDateJsonPro } from "@/utils";
import Image from "next/image";
import React, { useState } from "react";
import useSWR from "swr";

const fetcherEvent = (params) => EV_spEventListByStudent_Get(params);

const TrainingPoint = () => {
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { data: ListData } = useSWR(
    { UserId: user?.UserId, Month: selectedMonth, Year: selectedYear },
    fetcherEvent
  );

  const months = [
    { label: "Tháng 1", value: 1 },
    { label: "Tháng 2", value: 2 },
    { label: "Tháng 3", value: 3 },
    { label: "Tháng 4", value: 4 },
    { label: "Tháng 5", value: 5 },
    { label: "Tháng 6", value: 6 },
    { label: "Tháng 7", value: 7 },
    { label: "Tháng 8", value: 8 },
    { label: "Tháng 9", value: 9 },
    { label: "Tháng 10", value: 10 },
    { label: "Tháng 11", value: 11 },
    { label: "Tháng 12", value: 12 },
  ];

  const years = Array.from(
    { length: 10 },
    (_, i) => new Date().getFullYear() - i
  );

  const handleMonthClick = (monthValue) => {
    setSelectedMonth(monthValue);
  };

  const handleYearChange = (e) => {
    const year = Number(e.target.value);
    setSelectedYear(year);
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      {/* Dropdown for Year */}
      <div className="w-full flex items-center justify-between"></div>

      {/* Horizontal Tabs for Months */}
      <div className="w-full flex gap-2">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="border border-gray-300 rounded-md px-3 py-2 focus:ring focus:ring-blue-500 "
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <div className="flex overflow-x-auto gap-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {months.map((month) => (
            <button
              key={month.value}
              onClick={() => setSelectedMonth(month.value)}
              className={`flex-shrink-0 px-4 py-2 rounded-md text-sm font-medium transition shadow-md ${
                selectedMonth === month.value
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              {month.label}
            </button>
          ))}
        </div>
      </div>

      {/* Event Cards */}
      <div className=" w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {ListData?.length > 0 ? (
          ListData?.map((item) => <EventCard event={item} key={item.EventId} />)
        ) : (
          <div className="flex items-center justify-center h-full w-full col-span-full text-base font-semibold">
            Không có dữ liệu
          </div>
        )}
      </div>
    </div>
  );
};

const EventCard = ({ event }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataProof, setDataProof] = useState(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setDataProof(null);
  };

  return (
    <div className=" rounded overflow-hidden shadow-lg bg-white hover:shadow-xl transition duration-300">
      {/* Event Image */}
      <Image
        src={event.Thumnail}
        alt={event.EventName}
        width={500}
        className="max-h-[250px]"
        height={500}
      />
      {/* Event Content */}
      <div className="p-4">
        <h2 className="font-bold text-lg text-gray-800">{event.EventName}</h2>
        <p className="text-gray-600 text-sm mt-2 flex gap-4">
          <span className="font-semibold">
            Bắt đầu: {FormatDateJsonPro(event.StartTime, 10)}
          </span>{" "}
          <br />
          <span className="font-semibold">
            Kết thúc: {FormatDateJsonPro(event.EndTime, 10)}
          </span>{" "}
        </p>
        {event?.Status == 1 ? (
          <p className="text-green-500 text-sm mt-3 font-semibold">
            Điểm rèn luyện: {event.Point}
          </p>
        ) : (
          <p className="text-red-500 text-sm mt-3 font-semibold">Chưa duyệt</p>
        )}
      </div>
      {/* Action Button */}
      <div className="p-4 pt-2">
        <button
          onClick={() => {
            setIsModalOpen(true);
            setDataProof(event);
          }}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Xem minh chứng
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[700px]">
            <h2 className="text-lg font-bold mb-4">
              Minh Chứng {dataProof.EventName}
            </h2>
            <div className="flex items-center justify-center p2">
              <Image
                src={dataProof.ProofImage}
                width={700}
                height={700}
                alt="Hình ảnh minh chứng"
              />
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 mr-2"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingPoint;
