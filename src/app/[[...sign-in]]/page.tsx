"use client";
import InputField from "@/components/InputField";
import { useAuth } from "@/context/AuthContext";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  Username: z.string().min(1, { message: "Vui lòng nhập tên đăng nhập!" }),
  Password: z.string().min(1, { message: "Vui lòng nhập mật khẩu" }),
});

type Inputs = z.infer<typeof schema>;

const LoginPage = () => {
  const { login,user } = useAuth();
  console.log(user)
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });
  const onSubmit = handleSubmit(async (dataform) => {
    try {
      await login(dataform.Username, dataform.Password);
    } catch (err) {
      console.log(err);
    }
  });
  const events = [
    {
      title: "Pegaring Events",
      description: [
        "Ad yo be Events",
        "Alll You your closed of teen your xevent the emeryary your set your dotal lie und regtarl all your cd fil acettis."
      ],
      icon: null,
      thumbnail: "/path/to/pegaring-thumbnail.jpg",
      date: "2024-11-05" // Ngày tổ chức sự kiện
    },
    {
      title: "Teparatisign Events",
      description: [
        "Ton Sag your prean mil bil and the gredied lolliget budcer wiet-terding theplinced for recobulising events."
      ],
      icon: "calendar-alt",
      thumbnail: "/path/to/teparatisign-thumbnail.jpg",
      date: "2024-11-12"
    },
    {
      title: "Reyitems Events",
      description: [
        "Will Has your have pourdudraticed your age tehe seppry tire sed assegual prount mat in speripted ean nojication."
      ],
      icon: "clock",
      thumbnail: "/path/to/reyitems-thumbnail.jpg",
      date: "2024-11-19"
    }
  ];

  const registeredEvents = [
    {
      title: "Jard Gel Serinte",
      thumbnail: "https://storage.googleapis.com/a1aa/image/LdRXasBPtdLUMBBQ04SvWLVc6QwlJ4TZU9IyoVs6km34666E.jpg",
      date: "2024-11-02"
    },
    {
      title: "Jarm Handwian Tetiriss",
      thumbnail: "https://storage.googleapis.com/a1aa/image/LdRXasBPtdLUMBBQ04SvWLVc6QwlJ4TZU9IyoVs6km34666E.jpg",
      date: "2024-11-10"
    },
    {
      title: "Jand Inseontal Derentis",
      thumbnail: "https://storage.googleapis.com/a1aa/image/LdRXasBPtdLUMBBQ04SvWLVc6QwlJ4TZU9IyoVs6km34666E.jpg",
      date: "2024-11-15"
    },
    {
      title: "Jarns Limtagar Serings",
      thumbnail: "https://storage.googleapis.com/a1aa/image/LdRXasBPtdLUMBBQ04SvWLVc6QwlJ4TZU9IyoVs6km34666E.jpg",
      date: "2024-11-18"
    },
    {
      title: "Jarngra Fenerer",
      thumbnail: "https://storage.googleapis.com/a1aa/image/LdRXasBPtdLUMBBQ04SvWLVc6QwlJ4TZU9IyoVs6km34666E.jpg",
      date: "2024-11-20"
    },
    {
      title: "Mchaibel Sener Serints",
      thumbnail: "https://storage.googleapis.com/a1aa/image/LdRXasBPtdLUMBBQ04SvWLVc6QwlJ4TZU9IyoVs6km34666E.jpg",
      date: "2024-11-23"
    },
    {
      title: "Sohenil Series",
      thumbnail: "https://storage.googleapis.com/a1aa/image/LdRXasBPtdLUMBBQ04SvWLVc6QwlJ4TZU9IyoVs6km34666E.jpg",
      date: "2024-11-25"
    },
    {
      title: "Erg Werie iigh Sering",
      thumbnail: "https://storage.googleapis.com/a1aa/image/LdRXasBPtdLUMBBQ04SvWLVc6QwlJ4TZU9IyoVs6km34666E.jpg",
      date: "2024-11-30"
    }
  ];
  

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <div className="h-screen flex items-center justify-center bg-lamaSkyLight">
        <div>
          <div className="bg-white p-12 rounded-md shadow-2xl flex flex-col gap-2">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Image src="/logo.png" alt="" width={24} height={24} />
              TDMU-Event
            </h1>
            <h2 className="text-gray-400">Đăng nhập bằng tài khoản của bạn</h2>
            <InputField
              label="Tên đăng nhập"
              name="Username"
              register={register}
              error={errors?.Username}
            />
            <InputField
              label="Mật khẩu"
              type="password"
              name="Password"
              register={register}
              error={errors?.Password}
            />

            <button className="bg-blue-500 text-white my-1 rounded-md text-sm p-[10px]">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </form>


//     <body className="bg-gray-100">
//   <div className="max-w-6xl mx-auto p-6">
//    <div className="flex">
//     <div className="w-2/3 pr-6">
//      <h1 className="text-3xl font-bold mb-6">
//       Qcemins Events
//      </h1>
//      <h1 className="text-3xl font-bold mb-6">Qcemins Events</h1>
// {events.map((event, index) => (
//   <div className="mb-8" key={index}>
//     <h2 className="text-xl font-bold mb-2 flex items-center">
//       {event.icon && <i className={`fas fa-${event.icon} mr-2`}></i>}
//       {event.title}
//     </h2>
//     <img src={event.thumbnail} alt={`${event.title} thumbnail`} className="w-full h-auto mb-4 rounded-lg" />
//     <p className="text-gray-500 mb-2">Ngày tổ chức: {event.date}</p>
//     {event.description.map((desc, idx) => (
//       <p className="text-gray-700" key={idx}>
//         {desc}
//       </p>
//     ))}
//     <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
//       Đăng ký
//     </button>
//   </div>
// ))}
//     </div>
//     <div className="w-1/3 bg-gray-200 p-4 rounded-lg">
//      <h2 className="text-xl font-bold mb-4">
//       Registered Events
//      </h2>
//      <div className="space-y-4">
//   {registeredEvents.map((event, index) => (
//     <div className="flex items-center" key={index}>
//       <img
//         alt={`${event.title} thumbnail`}
//         className="w-12 h-12 rounded-full mr-4"
//         src={event.thumbnail}
//         width="50"
//         height="50"
//       />
//       <div>
//         <h3 className="font-bold">{event.title}</h3>
//         <p className="text-gray-500">Ngày tổ chức: {event.date}</p>
//       </div>
//     </div>
//   ))}
// </div>
//     </div>
//    </div>
//   </div>
//  </body>
  );
};

export default LoginPage;
