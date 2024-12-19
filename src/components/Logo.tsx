"use client";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = () => {
  const { user } = useAuth();
  return (
    <Link
      href={`/${user?.RoleTmp}`}
      className="flex items-center justify-center lg:justify-start gap-2"
    >
      <Image src="/logo.png" alt="logo" width={40} height={40} />
      <span className="hidden lg:block font-bold text-white">TDMU</span>
    </Link>
  );
};

export default Logo;
