'use client'


import React, { useEffect, useState, ForwardedRef } from 'react';
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker';

interface SelectDateTimeRangePickerProps {
  onSelected?: (value: [Date | null, Date | null]) => void;
  value?: [Date | null, Date | null]; // Mảng chứa 2 giá trị Date hoặc null (start date, end date)
  isRequired?: boolean;
  label?: string;
}

const SelectDateTimeRangePickerComp = React.forwardRef((
  {
    onSelected = () => { },
    value = [null, null], // Mặc định là một mảng chứa 2 giá trị null
    isRequired = false,
    label = "Ngày"
  }: SelectDateTimeRangePickerProps,
  ref: ForwardedRef<HTMLDivElement>
) => {

  const [valueS, setValueS] = useState<[Date | null, Date | null]>(value);

  // Cập nhật khi giá trị props `value` thay đổi
  useEffect(() => {
    setValueS(value);
  }, []);

  const onSelecteItem = (item: [Date | null, Date | null]) => {
    onSelected(item);  // Truyền giá trị mới ra ngoài qua props
    setValueS(item);   // Cập nhật giá trị state bên trong component
  };

  return (
    <div className="relative" ref={ref}>
      <label className="text-xs text-gray-500">
        {label}
        {isRequired && (
          <span className="text-red-500 ml-1">(*)</span>
        )}
      </label>
      <DateTimeRangePicker
        className="w-full border rounded-[70px] datetimerange border-x-1 border-y-1 h-10"
        value={valueS} // Giá trị được lưu trong state
        onChange={onSelecteItem} // Khi người dùng chọn giá trị mới
        format={"dd/MM/yyyy HH:mm"} // Định dạng hiển thị
      />
    </div>
  );
});

SelectDateTimeRangePickerComp.displayName = 'SelectDateTimeRangePickerComp';

export const SelectDateTimeRangePicker = React.memo(SelectDateTimeRangePickerComp);
