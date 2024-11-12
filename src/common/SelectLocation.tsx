"use client";
import { fetchLocation } from "@/app/action/location";
import React, { useEffect, useState, useCallback } from "react";
import Select, { SingleValue, ActionMeta } from "react-select";

interface DistrictOption {
  value: number;
  label: string;
}

interface SelectLocationProps {
  Disabled?: boolean;
  onSelected?: (item: SingleValue<DistrictOption>) => void;
  onActive?: number;
  Id?: number;
  label?: string;
  isRequired?: boolean;
}

const SelectLocationComp = React.forwardRef<
  HTMLDivElement,
  SelectLocationProps
>(
  (
    {
      Disabled = false,
      onSelected = () => {},
      onActive = 0,
      Id = 0,
      label = "Tiêu đề",
      isRequired = false,
    },
    ref
  ) => {
    const [data, setData] = useState<DistrictOption[]>([]);
    const [valueS, setValueS] = useState<SingleValue<DistrictOption>>(null);
    const [defaultOption, setDefault] = useState<DistrictOption | null>(null);

    const onSelecteItem = useCallback(
      (
        item: SingleValue<DistrictOption>,
        _actionMeta: ActionMeta<DistrictOption>
      ) => {
        onSelected(item);
        setValueS(item);
      },
      [onSelected]
    );

    const getLocation = async (Id: number) => {
      try {
        const list = await fetchLocation({ Id: 0 });
        const dataOptions = list.map((district: any) => ({
          value: district.LocationId,
          label: district.LocationName,
        }));

        setData(dataOptions);
        if (onActive !== 0) {
          const dataActive =
            dataOptions.find((a) => a.value === onActive) || null;
          setValueS(dataActive);
        } else {
          setValueS(defaultOption);
        }
      } catch (error) {
        console.error("Error fetching district data:", error);
      }
    };

    useEffect(() => {
      // Đặt giá trị mặc định chỉ khi Id thay đổi
      setDefault({ value: 0, label: "Chọn địa điểm" });
      // if (Id !== 0) {
      getLocation(Id);
      // }
    }, [Id]);

    useEffect(() => {
      // Cập nhật giá trị đã chọn khi dữ liệu thay đổi
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

// Assign a display name to the component
SelectLocationComp.displayName = "SelectLocationComp";

export const SelectLocation = React.memo(SelectLocationComp);
