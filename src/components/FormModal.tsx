"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";

const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
  loading: () => <h1>Loading...</h1>,
});
const StudentForm = dynamic(() => import("./forms/StudentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const LocationForm = dynamic(() => import("./forms/LocationForm"), {
  loading: () => <h1>Loading...</h1>,
});
const FacultyForm = dynamic(() => import("./forms/FacultyForm"), {
  loading: () => <h1>Loading...</h1>,
});
const EventForm = dynamic(() => import("./forms/EventForm"), {
  loading: () => <h1>Loading...</h1>,
});

const forms: {
  [key: string]: (
    type: "create" | "update",
    data: any,
    setOpen: (open: boolean) => void,
    onActionComplete?: () => void
  ) => JSX.Element;
} = {
  teacher: (type, data, setOpen, onActionComplete) => (
    <TeacherForm type={type} data={data} setOpen={setOpen} onActionComplete={onActionComplete} />
  ),
  student: (type, data, setOpen, onActionComplete) => (
    <StudentForm type={type} data={data} setOpen={setOpen} onActionComplete={onActionComplete} />
  ),
  event: (type, data, setOpen, onActionComplete) => (
    <EventForm type={type} data={data} setOpen={setOpen} onActionComplete={onActionComplete} />
  ),
  faculty: (type, data, setOpen, onActionComplete) => (
    <FacultyForm type={type} data={data} setOpen={setOpen} onActionComplete={onActionComplete} />
  ),
  location: (type, data, setOpen, onActionComplete) => (
    <LocationForm type={type} data={data} setOpen={setOpen} onActionComplete={onActionComplete} />
  ),
};

const FormModal = ({
  table,
  type,
  data,
  id,
  onActionComplete,
}: {
  table: "teacher" | "student" | "location" | "faculty" | "event";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number;
  onActionComplete?: () => void;
}) => {
  const [open, setOpen] = useState(false);

  const Form = () => {
    return type === "delete" && id ? (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          // Call delete action here and handle completion
          if (onActionComplete) onActionComplete();
          setOpen(false);
        }}
        className="p-4 flex flex-col gap-4"
      >
        <span className="text-center font-medium">
          All data will be lost. Are you sure you want to delete this {table}?
        </span>
        <button
          type="submit"
          className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center"
        >
          Delete
        </button>
      </form>
    ) : type === "create" || type === "update" ? (
      forms[table](type, data, setOpen, onActionComplete)
    ) : (
      "Form not found!"
    );
  };

  return (
    <>
      <button
        className={`w-8 h-8 flex items-center justify-center rounded-full ${
          type === "create" ? "bg-lamaYellow" : type === "update" ? "bg-lamaSky" : "bg-lamaPurple"
        }`}
        onClick={() => setOpen(true)}
      >
        <Image src={`/${type}.png`} alt="" width={16} height={16} />
      </button>
      {open && (
        <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <Form />
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="Close" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
