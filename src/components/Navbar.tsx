"use client";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import NotificationTest from "./NotificationTest";
import Link from "next/link";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const text = "TDMU"; // Your favorite word
  const numLayers = 26;
  const dropdownRef = useRef(null);
  // Hàm toggle trạng thái của dropdown
  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Kiểm tra nếu click không nằm trong ref
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false); // Ẩn dropdown
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="flex items-center justify-center py-4 px-2 shadow-lg"
      ref={dropdownRef}
    >
      <div className="text-center flex items-center justify-center grow">
        {/* <Image src="/logo.png" alt="logo" width={32} height={32} /> */}
        <div className="flex items-center justify-center">
          <div className="relative preserve-3d" id="ui">
            {Array.from({ length: numLayers }).map((_, i) => (
              <div
                key={i}
                className={`text absolute font-anton text-white mix-blend-screen`}
                style={{
                  clipPath: `polygon(
                calc(-30% + ${i * 10}px) 0,
                calc(-20% + ${i * 10}px) 0,
                calc(20% + ${i * 10}px) 100%,
                calc(0% + ${i * 10}px) 100%
              )`,
                  zIndex: numLayers - i, // Ensure layers are stacked properly
                  transform: `translateZ(${i * -2}px)`, // Add depth to each layer
                  animation: `wave 2000ms calc(${i} * 200ms - 10000ms) ease-in-out infinite alternate`,
                }}
              >
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 justify-end">
        {user && user?.RoleTmp !== "admin" && <NotificationTest />}
        {/* Avatar và sự kiện click để xổ dropdown */}
        <div className="relative">
          <Image
            src={user?.Avatar || "/avatar.png"}
            alt="avatar"
            width={40}
            height={40}
            className="rounded-full cursor-pointer object-cover"
            onClick={toggleDropdown} // Khi click vào avatar, đổi trạng thái dropdown
          />

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
              <p className="block px-4 py-2 text-sm hover:bg-gray-100 border-b-2">
                {user?.FullName}
              </p>
              <Link
                href="/profile"
                onClick={() => setDropdownOpen(false)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Cá nhân
              </Link>

              <div
                onClick={logout}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Đăng xuất
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
