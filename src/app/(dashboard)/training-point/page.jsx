'use client'
import React, { useState } from "react";
import useSWR from "swr";
const MonthYearPicker = () => {
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
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
    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
  
    const handleMonthClick = (monthValue) => {
      setSelectedMonth(monthValue);
    };
  
    const handleYearChange = (e) => {
      const year = Number(e.target.value);
      setSelectedYear(year);
    };
  
    return (
      <div className="flex flex-col items-center gap-4">
        {/* Dropdown for Year */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Chọn Năm
          </label>
          <select
            value={selectedYear}
            onChange={handleYearChange}
            className="border border-gray-300 rounded-md px-4 py-2 focus:ring focus:ring-blue-500 focus:outline-none"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
  
        {/* Tabs for Months */}
        <div className="w-full">
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Chọn Tháng
          </label>
          <div className="grid grid-cols-3 gap-2">
            {months.map((month) => (
              <button
                key={month.value}
                onClick={() => handleMonthClick(month.value)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
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
      </div>
    );
  };
  
export default MonthYearPicker;
