"use client";
import { fetchLectureSelect } from "@/app/action/user";
import React, { useEffect, useState, useCallback } from "react";
import Select, { SingleValue, MultiValue, ActionMeta } from "react-select";

interface DistrictOption {
  value: number;
  label: string;
}

interface SelectLectureProps {
  Disabled?: boolean;
  onSelected?: (item: string) => void; // Will return string of values separated by semicolons
  onActive?: number;
  Id?: any;
  multiple?: boolean;
  label?: string;
  isRequired?: boolean;
}

const SelectLectureComp = React.forwardRef<HTMLDivElement, SelectLectureProps>(
  (
    {
      Disabled = false,
      onSelected = () => {},
      onActive = 0,
      Id = 0,
      multiple = false,
      label = "Tiêu đề",
      isRequired = false,
    },
    ref
  ) => {
    const [data, setData] = useState<DistrictOption[]>([]);
    const [valueS, setValueS] = useState<
      SingleValue<DistrictOption> | MultiValue<DistrictOption>
    >(multiple ? [] : null);
    const [defaultOption] = useState<DistrictOption>({
      value: 0,
      label: "Chọn giảng viên",
    });

    const onSelecteItem = useCallback(
      (
        item: SingleValue<DistrictOption> | MultiValue<DistrictOption>,
        _actionMeta: ActionMeta<DistrictOption>
      ) => {
        if (multiple && Array.isArray(item)) {
          // Lọc ra các item không có value là 0
          const filteredValues = item.filter((i) => i.value !== 0);
          // Tạo chuỗi các giá trị được phân tách bằng dấu ;
          const selectedValuesString = filteredValues.map((i) => i.value).join(";");
          setValueS(filteredValues); // Cập nhật state với các giá trị đã lọc
          onSelected(selectedValuesString); // Trả về chuỗi các giá trị
        } else {
          const selectedItem = item as SingleValue<DistrictOption>;
          // Nếu chọn một item và giá trị là 0, reset
          if (selectedItem?.value === 0) {
            setValueS(null);
            onSelected(""); // Reset giá trị ra ngoài nếu giá trị là 0
          } else {
            setValueS(selectedItem); // Cập nhật giá trị đã chọn
            onSelected(selectedItem?.value.toString() || ""); // Trả về giá trị đã chọn
          }
        }
      },
      [onSelected, multiple]
    );

    const getLecture = async (Id: number) => {
      try {
        const list = await fetchLectureSelect({ Id });
        const dataOptions = list.map((lecture: any) => ({
          value: lecture.UserId,
          label: lecture.FullName,
        }));

        // Add the default option with value 0
        setData([defaultOption, ...dataOptions]);

        // Set default value on active or use defaultOption
        if (onActive !== 0) {
          const dataActive = dataOptions.find((a) => a.value === onActive) || null;
          setValueS(dataActive);
        } else {
          setValueS(defaultOption);
        }
      } catch (error) {
        console.error("Error fetching lecture data:", error);
      }
    };

    useEffect(() => {
      getLecture(Id);
    }, [Id]);

    useEffect(() => {
      if (onActive !== 0) {
        const _dataActive = data.find((p) => p.value === onActive) || null;
        setValueS(_dataActive);
      } else {
        setValueS(defaultOption);
      }
    }, [onActive, data, defaultOption]);

    return (
      <div className="w-full">
      <div className="relative">
        <label className=" text-xs text-gray-500">
          {label}
          {isRequired && <span className="text-red-500 ml-1">(*)</span>}
        </label>

        <Select
          isDisabled={Disabled}
          value={valueS}
          isMulti={multiple}
          onChange={onSelecteItem}
          className="text-sm"
          options={data}
          ref={ref}
        />
      </div>
    </div>
    );
  }
);

SelectLectureComp.displayName = "SelectLectureComp";

export const SelectLecture = React.memo(SelectLectureComp);
