"use client";
import { fetchEventList } from "@/app/action/event";
import { useAuth } from "@/context/AuthContext";
import { Alertsuccess, Alertwarning, FormatDateJsonPro } from "@/utils";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

const fetcher = (params: object) => fetchEventList(params);

const mockOtherPosts = [
  { id: "1", title: "Getting Started with React", author: "Alice" },
  { id: "2", title: "Why Choose Next.js?", author: "Bob" },
  { id: "3", title: "The Power of Tailwind CSS", author: "Charlie" },
  { id: "4", title: "React vs Vue: Which is Better?", author: "Daisy" },
];
const BlogDetail = ({ params }: { params: { id: number } }) => {
  const { id } = params;
  const { user } = useAuth();
  const { data: Event, mutate } = useSWR({ EventId: id,UserId: user?.UserId }, fetcher);

  const handleRegisterEvent = async (item) => {
    try {
      const pr = {
        EventId: id,
        StudentId: user?.UserId,
        AttendanceStatus: 0,
      };
      const res = await EV_spEventStudent_Register(pr);
      if (res?.Status == "OK") {
        Alertsuccess(res?.ReturnMess);
      } else {
        Alertwarning(res?.ReturnMess);
      }
    } catch (err) {
      console.log(err);
    }
  };
  console.log(Event)

  if (!Event) return <p>Loading...</p>;
  return (
    <div className=" mx-auto py-8 px-4 flex flex-col md:flex-row">
      {/* Nội dung chính của bài viết */}
      <div className="flex-1 md:pr-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          {Event[0]?.EventName}
        </h1>
        <div className="flex items-center text-sm text-gray-500 mb-6 gap-2">
          <span>Đăng bởi: Admin</span>
          <span className="mx-2">|</span>
          <span>Ngày bắt đầu: {FormatDateJsonPro(Event[0]?.StartTime, 7)}</span>
          {!Event[0]?.IsRegister && Event[0]?.IsRegister != 0 && (
            <button
              onClick={() => {
                handleRegisterEvent(Event[0]);
              }}
              className=" px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Đăng ký
            </button>
          )}
        </div>
        <div
          className="prose prose-lg max-w-none mb-8 text-gray-700"
          dangerouslySetInnerHTML={{ __html: Event[0]?.EventDescription }}
        />

        {/* Phần bình luận */}
      </div>

      {/* RightBar hiển thị các bài viết khác */}
      <div className="w-full md:w-1/3 mt-8 md:mt-0 md:border-l md:pl-8">
        <h2 className="text-2xl font-semibold mb-4">Other Posts</h2>
        <div className="space-y-4">
          {mockOtherPosts.map((post) => (
            <div
              key={post.id}
              className="p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <a
                href={`/blog/${post.id}`}
                className="text-lg font-medium text-indigo-600 hover:text-indigo-800"
              >
                {post.title}
              </a>
              <p className="text-sm text-gray-500">By {post.author}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
