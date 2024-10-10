"use client";
import { fetchEventType } from "@/app/action/event";
import React, { useEffect, useState, useCallback } from "react";
import Select, { SingleValue, ActionMeta } from "react-select";

interface DistrictOption {
  value: number;
  label: string;
}

interface SelectEventTypeProps {
  Disabled?: boolean;
  onSelected?: (item: SingleValue<DistrictOption>) => void;
  Id?: number;
  label?: string;
  isRequired?: boolean;
}

const SelectEventTypeComp = React.forwardRef<HTMLDivElement, SelectEventTypeProps>(
  ({ Disabled = false, onSelected = () => {}, Id = 0, label = "Tiêu đề", isRequired = false }, ref) => {
    const [data, setData] = useState<DistrictOption[]>([]);
    const [valueS, setValueS] = useState<SingleValue<DistrictOption>>(null);

    const onSelecteItem = useCallback(
      (item: SingleValue<DistrictOption>, _actionMeta: ActionMeta<DistrictOption>) => {
        onSelected(item);  // Call the parent's onSelected with the selected item
        setValueS(item);    // Update the selected value
      },
      [onSelected]
    );

    const getListDistrictFromAPI = async (Id: number) => {
      try {
        const list = await fetchEventType({ Id });
        const dataOptions = list.map((district: any) => ({
          value: district.Id,
          label: district.EventTypeName,
        }));

        setData(dataOptions);

        // Automatically select the option if `Id` matches an option
        const selectedOption = dataOptions.find((option) => option.value === Id) || null;
        setValueS(selectedOption);
      } catch (error) {
        console.error("Error fetching event type data:", error);
      }
    };

    useEffect(() => {
      // Fetch the list whenever the `Id` changes
      getListDistrictFromAPI(Id);
    }, [Id]);

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

SelectEventTypeComp.displayName = "SelectEventTypeComp";

export const SelectEventType = React.memo(SelectEventTypeComp);
