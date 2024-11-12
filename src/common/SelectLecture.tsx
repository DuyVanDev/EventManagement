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
  onActive?: string; // Change type to string to accept comma-separated values
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
      onActive = "",
      Id = 0,
      multiple = false,
      label = "Tiêu đề",
      isRequired = false,
    },
    ref
  ) => {
    const [data, setData] = useState<DistrictOption[]>([]);
    const [valueS, setValueS] = useState<SingleValue<DistrictOption> | MultiValue<DistrictOption>>(
      multiple ? [] : null
    );
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
          const filteredValues = item.filter((i) => i.value !== 0);
          const selectedValuesString = filteredValues.map((i) => i.value).join(";");
          setValueS(filteredValues);
          onSelected(selectedValuesString);
        } else {
          const selectedItem = item as SingleValue<DistrictOption>;
          if (selectedItem?.value === 0) {
            setValueS(null);
            onSelected("");
          } else {
            setValueS(selectedItem);
            onSelected(selectedItem?.value.toString() || "");
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

        setData([defaultOption, ...dataOptions]);

        // Set default value on active or use defaultOption
        if (onActive && multiple) {
          const activeValues = onActive.split(",").map(Number);
          const dataActive = dataOptions.filter((option) =>
            activeValues.includes(option.value)
          );
          setValueS(dataActive);
        } else if (onActive) {
          const dataActive = dataOptions.find((a) => a.value === Number(onActive)) || null;
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
      if (onActive && multiple) {
        const activeValues = onActive.split(";").map(Number);
        const _dataActive = data.filter((p) => activeValues.includes(p.value));
        setValueS(_dataActive);
      } else if (onActive) {
        const _dataActive = data.find((p) => p.value === Number(onActive)) || null;
        setValueS(_dataActive);
      } else {
        setValueS(defaultOption);
      }
    }, [onActive, data, defaultOption, multiple]);

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
