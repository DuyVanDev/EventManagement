"use client";
import { EV_spEvent_Login } from "@/app/action/user";
import { Alertsuccess, Alertwarning } from "@/utils/Notifications";
import { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the user data
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Define the AuthContext shape
interface AuthContextProps {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Create a custom hook to access AuthContext
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

  // Function to handle login
  const login = async (email: string, password: string) => {
    // Gọi API đăng nhập để xác thực và nhận token
    try {
      const response = await EV_spEvent_Login({
        Username: email,
        Password: password,
      });

      if (response) {
        if (response?.Status == "OK") {
          setUser(response?.result[0]);
          console.log(response?.result[0]?.RoleTmp)
          // Lưu token vào cookie/localStorage nếu cần thiết
          document.cookie = `role=${response?.result[0]?.RoleTmp}; path=/; max-age=86400;`;

          // Điều hướng sau khi đăng nhập thành công
          window.location.href = `/${response?.result[0]?.RoleTmp}`;
          Alertsuccess("Đăng nhập thành công");
        } else {
          Alertwarning(response?.result);
        }
        // Lưu thông tin user vào state
      } else {
        throw new Error("Login failed");
      }
    } catch (err) {
      throw new Error("Login failed");
    }
  };

  // Function to handle logout
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
