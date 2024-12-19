import Logo from "@/components/Logo";
import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <div className="h-screen flex">
        {/* LEFT */}
        <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4 bg-[#0185d1] ">
          <Logo />
          <Menu />
        </div>
        {/* RIGHT */}
        <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll flex flex-col ">
          <Navbar />
          {children}
        </div>
      </div>
    </AuthProvider>
  );
}
