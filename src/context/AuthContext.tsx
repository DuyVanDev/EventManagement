'use client'
import { EV_spEvent_Login } from "@/app/action/user";
import { routeAccessMap } from "@/lib/settings";
import { Alertsuccess, Alertwarning } from "@/utils/Notifications";
import { useRouter } from "next/navigation";
import { createContext, useState, useContext, ReactNode, useEffect } from "react";

// User data shape
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// AuthContext shape
interface AuthContextProps {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create context
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Custom hook for using AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// AuthProvider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter(); // Use router for navigation

  // Get user from localStorage when the app loads
  useEffect(() => {
    const storedUser = localStorage.getItem("userEvent");
    if (storedUser) {
      const userFromStorage = JSON.parse(storedUser);
      setUser(userFromStorage);
  
      const role = document.cookie
        .split("; ")
        .find((row) => row.startsWith("role="))
        ?.split("=")[1];
  
      if (role) {
        const allowedPaths = Object.entries(routeAccessMap)
          .filter(([, allowedRoles]) => allowedRoles.includes(role))
          .map(([path]) => new RegExp(`^${path}$`));
  
        const currentPath = window.location.pathname;
  
        // Kiểm tra nếu currentPath không nằm trong danh sách allowedPaths
        const isPathAllowed = allowedPaths.some((regex) => regex.test(currentPath));
  
        if (isPathAllowed) {
          router.push(`${currentPath}`); // Điều hướng về trang chính của role nếu không hợp lệ
        }
        else {
          router.push(`/${role}`); 
        }
      }
    } else {
      router.push("/sign-in");
    }
  }, [router]);
  // Login function
  const login = async (username: string, password: string) => {
    try {
      // Call API and get user data
      const response = await EV_spEvent_Login({
        Username: username,
        Password: password,
      });

      if (response?.Status === "OK") {
        setUser(response.result[0]);
        localStorage.setItem("userEvent", JSON.stringify(response.result[0]));
        document.cookie = `role=${response.result[0]?.RoleTmp}; path=/; max-age=86400;`;
        window.location.href = `/${response.result[0]?.RoleTmp}`;
        Alertsuccess("Đăng nhập thành công");
      } else {
        Alertwarning(response?.result);
      }
    } catch (err) {
      throw new Error("Login failed");
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("userEvent");
    document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    window.location.href = "/sign-in";

  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
