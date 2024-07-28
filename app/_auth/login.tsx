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
      <div className="w-1/2 flex items-center justify-center bg-white">
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
                placeholder="admin@example.com"
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
                placeholder="••••••••"
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
      <div className="w-1/2 relative">
        <Image src={books} alt="Books" layout="fill" objectFit="cover" />
      </div>
    </div>
  );
}
