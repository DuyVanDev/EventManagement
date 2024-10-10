"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import {
  SelectDateTimeRangePicker,
  SelectLecture,
  SelectLocation,
} from "@/common";
import { SelectEventType } from "@/common/SelectTypeEvent";
import { useEffect, useState } from "react";
import { EV_spEvent_Save } from "@/app/action/event";

const schema = z.object({
  EventId: z.number(),
  EventName: z
    .string()
    .min(10, { message: "Tên sự kiện phải có ít nhất 10 ký tự1" }),
  EventDescription: z.string().min(1, { message: "Hãy nhập mô tả sự kiện!" }),
  ParticipantLimit: z.string().min(1, { message: "Nhập số lượng giới hạn!" }),
  Time: z
    .array(z.date())
    .length(2, { message: "Phải chọn cả thời gian bắt đầu và kết thúc!" }),
  LocationId: z.number().min(1, { message: "Vui lòng chọn địa điểm!" }),
  EventTypeId: z.number().min(1, { message: "Vui lòng chọn loại sự kiện!" }),
  LectureId: z.string().min(1, { message: "Vui lòng chọn giảng viên!" }),
});

type Inputs = z.infer<typeof schema>;

const EventForm = ({
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
      EventId: data.EventId,
      EventName: data.EventName,
      EventDescription: data.EventDescription,
      Time: data.Time,
      LocationId: data.LocationId,
      LectureId: data.LectureId,
      EventTypeId: data.EventTypeId,
      ParticipantLimit: data.ParticipantLimit,
    },
  });

  useEffect(() => {
    if (data) {
      setValue("EventName", data.EventName);
      setValue("EventDescription", data.EventDescription);
      setValue("ParticipantLimit", data.ParticipantLimit);
      setValue("Time", data.Time);
    }
  }, [data, setValue]);
  const onSubmit = handleSubmit(async (dataform) => {
    try {
      const pr = {
        EventId: dataform?.EventId,
        EventName: dataform?.EventName,
        EventDescription: dataform?.EventDescription,
        StartTime: dataform?.Time[0],
        EndTime: dataform?.Time[1],
        LocationId: dataform?.LocationId,
        LectureId: dataform?.LectureId,
        EventTypeId: dataform?.EventTypeId,
        ParticipantLimit: dataform?.ParticipantLimit,
      };
      console.log(dataform);
      const result = await EV_spEvent_Save(pr);
      console.log(result);
    } catch (err) {
      console.log(err);
    }
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">Thêm mới sự kiện</h1>

      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Tên sự kiện"
          name="EventName"
          defaultValue={data?.EventName}
          register={register}
          error={errors?.EventName}
        />

        <div>
          <Controller
            name="LocationId"
            control={control}
            render={({ field: { onChange, value } }) => (
              <SelectLocation
                onSelected={(selected) => onChange(selected.value)}
                label="Địa điểm"
                Id={data?.LocationId}
              />
            )}
          />
          {errors.LocationId && (
            <span className="text-red-500 text-sm">
              {errors.LocationId.message}
            </span>
          )}
        </div>

        <div>
          <Controller
            name="EventTypeId"
            control={control}
            render={({ field: { onChange, value } }) => (
              <SelectEventType
                onSelected={(selected) => onChange(selected.value)}
                label="Loại sự kiện"
              />
            )}
          />
          {errors.EventTypeId && (
            <span className="text-red-500 text-sm">
              {errors.EventTypeId.message}
            </span>
          )}
        </div>

        <div>
          <Controller
            name="LectureId"
            control={control}
            render={({ field: { onChange, value } }) => (
              <SelectLecture
                onSelected={(selected) => {
                  console.log("Selected from controller:", selected); // Kiểm tra giá trị
                  onChange(selected); // Đảm bảo rằng bạn đang gọi onChange đúng cách
                }}
                label="Chọn giảng viên"
                multiple={true}
              />
            )}
          />
          {errors.LectureId && (
            <span className="text-red-500 text-sm">
              {errors.LectureId.message}
            </span>
          )}
        </div>
        <InputField
          label="Số lượng"
          type="number"
          defaultValue={data?.ParticipantLimit}
          name="ParticipantLimit"
          register={register}
          error={errors.ParticipantLimit}
        />
        <div>
          <Controller
            name="Time"
            control={control}
            render={({ field: { onChange, value } }) => (
              <SelectDateTimeRangePicker
                label="Thời gian"
                onSelected={onChange} // Kết nối sự kiện thay đổi với react-hook-form
                value={value} // Liên kết giá trị với form
                isRequired={true}
              />
            )}
          />
          {errors.Time && (
            <span className="text-red-500">
              {errors.Time.message as string}
            </span>
          )}
        </div>

        <div className="col-span-2">
          <InputField
            label="Mô tả"
            name="EventDescription"
            defaultValue={data?.EventDescription}
            register={register}
            error={errors?.EventDescription}
          />
        </div>

        {/* <textarea/> */}

        {/* <div className="flex flex-col gap-2 w-full md:w-1/4 justify-center">
          <label
            className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
            htmlFor="img"
          >
            <Image src="/upload.png" alt="" width={28} height={28} />
            <span>Upload a photo</span>
          </label>
          <input type="file" id="img" {...register("img")} className="hidden" />
          {errors.img?.message && (
            <p className="text-xs text-red-400">
              {errors.img.message.toString()}
            </p>
          )}
        </div> */}
      </div>
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Tạo" : "Sửa"}
      </button>
    </form>
  );
};

export default EventForm;
