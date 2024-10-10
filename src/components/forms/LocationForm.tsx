"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";

import { useEffect } from "react";
import { Alertsuccess, Alertwarning } from "@/utils/Notifications";
import { fetchLocationSave } from "@/app/action/location";

const schema = z.object({
  LocationId: z.number(),
  LocationName: z
    .string()
    .min(1, { message: "Vui lòng nhập tên địa điểm" }),
    Address: z
    .string()
    .min(1, { message: "Vui lòng nhập địa chỉ" }),
    Capacity: z
    .number()
    .min(1, { message: "Nhập giá trị lớn hơn 0" }),
});

type Inputs = z.infer<typeof schema>;

const LocationForm = ({
  type,
  data,
}: {
  type: "create" | "update";
  data?: any;
}) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      LocationId: data.LocationId,
      LocationName: data.LocationName,
    },
  });

  useEffect(() => {
    if (data) {
      setValue("LocationId", data.LocationId);
      setValue("LocationName", data.LocationName);
      setValue("Address", data.Address);
      setValue("Capacity", data.Capacity);
    }
  }, [data, setValue]);
  const onSubmit = handleSubmit(async (dataform) => {
    try {
      const pr = {
        LocationId: dataform?.LocationId,
        LocationName: dataform?.LocationName,
        Address: dataform?.Address,
        Capacity: dataform?.Capacity,
      };
      const result = await fetchLocationSave(pr);
      if (result.Status == "OK") {
        Alertsuccess(result.ReturnMess);
      } else {
        Alertwarning(result.ReturnMess);
      }
    } catch (err) {
      console.log(err);
    }
  });

  return (
    <form className="flex flex-col gap-2" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">Thêm mới địa điểm</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField
          label="Tên Khoa - Viện"
          name="LocationName"
          defaultValue={data?.LocationName}
          register={register}
          error={errors?.LocationName}
        />

        <InputField
          label="Địa chỉ"
          name="Address"
          defaultValue={data?.Address}
          register={register}
          error={errors?.Address}
        />
         <InputField
          label="Sức chứa"
          type="number"
          name="Capacity"
          defaultValue={data?.Capacity}
          register={register}
          error={errors?.Capacity}
        />
      </div>
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Tạo" : "Sửa"}
      </button>
    </form>
  );
};

export default LocationForm;
