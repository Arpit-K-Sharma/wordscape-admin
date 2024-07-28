"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAdmin } from "../_axios/axiosInstance";
import UnauthorizedAccess from "../Unauthorized";
export const useAdminCheck = () => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const adminStatus = await isAdmin();
        setIsAuthorized(adminStatus);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  return { isAuthorized, isLoading };
};

export const AuthorizationWrapper = ({
  children,
  pathname,
}: {
  children: React.ReactNode;
  pathname: string;
}) => {
  const { isAuthorized, isLoading } = useAdminCheck();
  const router = useRouter();
  const [showUnauthorized, setShowUnauthorized] = useState(false);

  useEffect(() => {
    if (isAuthorized === false && pathname !== "/") {
      setShowUnauthorized(true);
      const timer = setTimeout(() => {
        router.push("/");
      }, 5000); // Redirect after 5 seconds

      return () => clearTimeout(timer); // Cleanup the timer on unmount
    }
  }, [isAuthorized, pathname, router]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-xl">Checking admin status...</div>
      </div>
    );
  }

  // Render UnauthorizedAccess if not authorized
  if (showUnauthorized) {
    return <UnauthorizedAccess />;
  }

  // Render children if authorized
  return <>{children}</>;
};
