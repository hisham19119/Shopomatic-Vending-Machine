"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  authService,
  LoginCredentials,
  RegisterData,
  User,
  userService,
} from "@/services/api-service";

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = (
  props: React.PropsWithChildren<Record<never, never>>
) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = authService.getToken();
      if (token) {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
        } else {
          // If token exists but no user data, try fetching user info
          try {
            const fetchedUser = await userService.getSelf();
            setUser(fetchedUser);
            setIsAuthenticated(true);
            localStorage.setItem("user", JSON.stringify(fetchedUser));
          } catch (error) {
            // Token might be invalid/expired
            await logout();
          }
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    };
    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      await authService.login(credentials);
      const loggedInUser = await userService.getSelf();
      setUser(loggedInUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login failed in context:", error);
      // Re-throw to allow component-level error handling
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      // Let authService handle removal of items from localStorage
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const newUser = await authService.register(userData);
      setUser(newUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Registration failed in context:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, register, isAuthenticated }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
