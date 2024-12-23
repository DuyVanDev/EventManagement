import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-grow items-center justify-center bg-gray-50">
      <div className="rounded-lg bg-white p-8 text-center shadow-xl">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="text-gray-600">Không tìm thấy trang</p>
        <Link
          href="/"
          className="mt-4 inline-block rounded bg-blue-default px-4 py-2 font-semibold text-white hover:bg-blue-600"
        >
            Trở về
        </Link>
      </div>
    </div>
  );
}
