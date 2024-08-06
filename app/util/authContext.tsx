"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UnauthorizedAccess from "../Unauthorized";
import Cookies from "js-cookie";

export const useAdminCheck = () => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      // Assuming admin status is determined by the presence of a token
      const token = Cookies.get("accessToken");
      setIsAuthorized(!!token); // Set authorized if token exists
      setIsLoading(false);
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
      }, 5000);

      return () => clearTimeout(timer);
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
