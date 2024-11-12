"use client";
import { fetchEventList } from "@/app/action/event";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

const fetcher = (params: object) => fetchEventList(params);
const mockBlogPost = {
  title: "Understanding Next.js and Tailwind CSS",
  author: "Jane Doe",
  date: "November 8, 2024",
  content: `
    <p>Next.js and Tailwind CSS are a powerful combination for building web applications. In this blog post, we explore how to use Next.js, a React framework, with Tailwind CSS for styling.</p>
    <h2>Why Next.js?</h2>
    <p>Next.js provides server-side rendering and static site generation, which improves performance and SEO. It also simplifies routing and API integration in React apps.</p>
    <h2>Why Tailwind CSS?</h2>
    <p>Tailwind CSS is a utility-first CSS framework that allows for rapid styling directly within HTML and JSX files. This approach makes it easy to build responsive layouts without custom CSS files.</p>
  `,
  comments: [
    { id: 1, name: "John", message: "Great post!" },
    { id: 2, name: "Emma", message: "Really helpful, thanks!" },
  ],
};
const mockOtherPosts = [
  { id: "1", title: "Getting Started with React", author: "Alice" },
  { id: "2", title: "Why Choose Next.js?", author: "Bob" },
  { id: "3", title: "The Power of Tailwind CSS", author: "Charlie" },
  { id: "4", title: "React vs Vue: Which is Better?", author: "Daisy" },
];
const BlogDetail = ({ params }: { params: { id: number } }) => {
  const { id } = params;
  console.log(id);
  const [blogPost, setBlogPost] = useState(null);

  // Giả lập API call
  useEffect(() => {
    if (id) {
      setBlogPost(mockBlogPost); // Thay thế bằng API fetch dữ liệu thực tế
    }
  }, [id]);

  if (!blogPost) return <p>Loading...</p>;
  // const { data: ListData, mutate } = useSWR({ EventId: id }, fetcher);
  return (
    <div className=" mx-auto py-8 px-4 flex flex-col md:flex-row">
      {/* Nội dung chính của bài viết */}
      <div className="flex-1 md:pr-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">
          {blogPost.title}
        </h1>
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <span>By {blogPost.author}</span>
          <span className="mx-2">|</span>
          <span>{blogPost.date}</span>
        </div>
        <div
          className="prose prose-lg max-w-none mb-8 text-gray-700"
          dangerouslySetInnerHTML={{ __html: blogPost.content }}
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
