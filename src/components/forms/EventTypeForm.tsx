"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";

import { useEffect, useState } from "react";
import { EV_spEventType_Save } from "@/app/action/event";
import { Alertsuccess, Alertwarning } from "@/utils/Notifications";

const schema = z.object({
  Id: z.number(),
  EventTypeName: z
    .string()
    .min(2, { message: "Tên loại sự kiện phải có ít nhất 2 ký tự" }),
});

type Inputs = z.infer<typeof schema>;

const EventTypeForm = ({
  type,
  data,
  setOpen,
  onActionComplete,
  onActionDelete,
}: {
  type: "create" | "update";
  data?: any;
  setOpen? : any,
  onActionComplete: any,
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
      Id: data.Id,
      EventTypeName: data.EventTypeName,
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setValue("Id", data.Id);
      setValue("EventTypeName", data.EventTypeName);
    }
  }, [data, setValue]);
  const onSubmit = handleSubmit(async (dataform) => {
    setIsLoading(true);
    try {
      const pr = {
        Id: dataform?.Id,
        EventTypeName: dataform?.EventTypeName,
      };
      const result = await EV_spEventType_Save(pr);
      if (result.Status == "OK") {
        Alertsuccess(result.ReturnMess);
        setOpen(false);
        onActionComplete();
        setIsLoading(false);
      } else {
        Alertwarning(result.ReturnMess);
        setIsLoading(false);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <form className="flex flex-col gap-2" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">{type === "create" ? (
          "Thêm mới"
        ) : (
          "Sửa"
        )}</h1>

      <div className="grid grid-cols-1 gap-4">
        <InputField
          label="Tên loại sự kiện"
          name="EventTypeName"
          register={register}
          error={errors?.EventTypeName}
        />
      </div>
      <button
        className={`bg-sky-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2 ${
          isLoading ? "cursor-not-allowed opacity-75" : ""
        }`}
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
        ) : type === "create" ? (
          "Tạo"
        ) : (
          "Sửa"
        )}
      </button>
    </form>
  );
};

export default EventTypeForm;
