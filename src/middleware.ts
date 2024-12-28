import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routeAccessMap } from "./lib/settings";

// Hàm lấy thông tin role từ cookie hoặc session
function getUserRole(req: NextRequest): string | null {
  const role = req.cookies.get("role")?.value; // Lấy role từ cookie
  return role ?? null; // Trả về null nếu không có giá trị
}

// Middleware để kiểm tra quyền truy cập và điều hướng
export function middleware(req: NextRequest) {
  const role = getUserRole(req); // Lấy role của người dùng

  // Nếu không có role (chưa đăng nhập), điều hướng về trang /sign-in
  if (!role && req.nextUrl.pathname != "/register" && req.nextUrl.pathname != "/forgotpassword" && req.nextUrl.pathname != "/profile") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Nếu người dùng đã đăng nhập và truy cập vào /sign-in, điều hướng về trang phù hợp với role
  if (role && (req.nextUrl.pathname === "/" || req.nextUrl.pathname === "/sign-in")) {
    return NextResponse.redirect(new URL(`/${role}`, req.url));
  }

  // Kiểm tra quyền truy cập dựa trên routeAccessMap
  for (const [route, allowedRoles] of Object.entries(routeAccessMap)) {
    const regex = new RegExp(`^${route}$`); // Tạo regex từ route pattern
    if (regex.test(req.nextUrl.pathname)) {
      if (!allowedRoles.includes(role)) {
        return NextResponse.redirect(new URL(`/${role}`, req.url));
      }
    }
  }

  // Nếu mọi điều kiện đều hợp lệ, cho phép tiếp tục
  return NextResponse.next();
}

// Cấu hình matcher để middleware chỉ chạy trên các route nhất định
export const config = {
  matcher: [
    // Các route mà middleware sẽ kiểm tra
    "/admin(.*)", 
    "/student(.*)", 
    "/teacher(.*)", 
    "/parent(.*)", 
    "/list/(.*)", 
    "/sign-in", 
    "/myevent(.*)",
    "/training-point(.*)",
  ],
};
