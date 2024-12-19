"use client";
import { fetchEventType } from "@/app/action/event";
import { fetchFaculty } from "@/app/action/faculty";
import React, { useEffect, useState, useCallback } from "react";
import Select, { SingleValue, ActionMeta } from "react-select";

interface DistrictOption {
  value: number;
  label: string;
}

interface SelectFacultyProps {
  Disabled?: boolean;
  onSelected?: (item: SingleValue<DistrictOption>) => void;
  FacultyId?: number;
  label?: string;
  isRequired?: boolean;
}

const SelectFacultyComp = React.forwardRef<HTMLDivElement, SelectFacultyProps>(
  ({ Disabled = false, onSelected = () => {}, FacultyId = 0, label = "Tiêu đề", isRequired = false }, ref) => {
    const [data, setData] = useState<DistrictOption[]>([]);
    const [valueS, setValueS] = useState<SingleValue<DistrictOption>>(null);

    const onSelecteItem = useCallback(
      (item: SingleValue<DistrictOption>, _actionMeta: ActionMeta<DistrictOption>) => {
        onSelected(item);  // Call the parent's onSelected with the selected item
        setValueS(item);    // Update the selected value
      },
      [onSelected]
    );


    const getListDistrictFromAPI = async (FacultyId: number) => {
      try {
        const list = await fetchFaculty({ FacultyId : 0 });
        const dataOptions = list.map((district: any) => ({
          value: district.FacultyId,
          label: district.FacultyName,
        }));

        setData(dataOptions);

        // Automatically select the option if `Id` matches an option
        const selectedOption = dataOptions.find((option) => option.value === FacultyId) || null;
        setValueS(selectedOption);
      } catch (error) {
        console.error("Error fetching event type data:", error);
      }
    };

    useEffect(() => {
      // Fetch the list whenever the `Id` changes
      getListDistrictFromAPI(FacultyId);
    }, [FacultyId]);

    return (
      <div className="">
        <div className="relative">
        <label className=" text-xs text-gray-500">
          {label}
          {isRequired && <span className="text-red-500 ml-1">(*)</span>}
        </label>

          <Select
            isDisabled={Disabled}
            value={valueS}
            onChange={onSelecteItem}
            options={data}
            ref={ref}
          />
        </div>
      </div>
    );
  }
);

SelectFacultyComp.displayName = "SelectFacultyComp";

export const SelectFaculty = React.memo(SelectFacultyComp);
