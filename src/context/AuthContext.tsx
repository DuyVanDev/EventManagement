'use client'
import { EV_spEvent_Login } from "@/app/action/user";
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
      // Điều hướng đến trang tương ứng với vai trò của người dùng
      // document.cookie = `role=${userFromStorage.RoleTmp}; path=/; max-age=86400;`;
      // router.push(`/${userFromStorage?.RoleTmp}`);
    } else {
      // Nếu không có user trong localStorage, điều hướng đến trang đăng nhập
      if (router.pathname !== "/sign-in") {
        router.push("/sign-in");
      }
    }
  }, [router]);
  // Login function
  const login = async (email: string, password: string) => {
    try {
      // Call API and get user data
      const response = await EV_spEvent_Login({
        Username: email,
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
    document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    window.location.href = "/sign-in";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
