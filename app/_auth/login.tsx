"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AiOutlineLoading } from "react-icons/ai";
import logo from "../images/LogoOnly.png";
import books from "../images/books.jpg";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (email === "admin@gmail.com" && password === "password") {
      console.log("Login successful");
      router.push("/inventory");
    } else {
      setError("Invalid email or password");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 p-8 md:p-16 flex items-center justify-center">
        <Card className="w-full max-w-md bg-white">
          <CardHeader className="space-y-1">
            <Image
              className="mx-auto my-1 mb-5 w-24 sm:w-28 md:w-32 lg:w-36 h-auto"
              src={logo}
              alt="Logo"
              width={144}
              height={144}
              priority
            />
            <CardTitle className="text-2xl font-semibold text-center">
              WordScape Admin Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="label">
                  <span className="label-text text-[16px] text-black">
                    Email address
                  </span>
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input input-bordered w-full bg-white text-gray-900"
                  pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="label">
                  <span className="label-text text-black text-[16px]">
                    Password
                  </span>
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input input-bordered w-full bg-white text-gray-900"
                />
              </div>
              <Button
                type="submit"
                className="btn btn-neutral w-full hover:text-white relative"
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
          </CardContent>
        </Card>
      </div>
      <div className="hidden lg:block flex-1 relative">
        <Image src={books} alt="Books" layout="fill" objectFit="cover" />
      </div>
    </div>
  );
}
