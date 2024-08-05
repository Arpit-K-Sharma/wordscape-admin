"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AiOutlineLoading } from "react-icons/ai";
import logo from "../images/LogoOnly.png";
import books from "../images/books.jpg";
import { useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { adminLogin } from "../_axios/axiosInstance";
import { error } from "console";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const success = await adminLogin(email, password);

    if (success) {
      router.push("/erp/dashboard");
    } else {
      setLoading(false);
      toast.error("Failed to login");
    }
  };

  return (
    <div className="flex min-h-screen">
      <Toaster position="top-right" />
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white">
        <div className="w-full max-w-md p-8">
          <Image
            className="mx-auto mb-8 w-24 sm:w-28 md:w-32 lg:w-36 h-auto"
            src={logo}
            alt="Logo"
            width={144}
            height={144}
            priority
          />
          <h2 className="text-2xl font-semibold text-center mb-6">
            WordScape Admin Login
          </h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your credentials."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-gray-100"
                pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-gray-100"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-zinc-900 hover:bg-zinc-700 text-white relative"
            >
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <AiOutlineLoading className="animate-spin text-white" />
                </div>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </div>
      </div>
      <div className="hidden lg:block w-1/2 relative">
        <Image src={books} alt="Books" layout="fill" objectFit="cover" />
      </div>
    </div>
  );
}
