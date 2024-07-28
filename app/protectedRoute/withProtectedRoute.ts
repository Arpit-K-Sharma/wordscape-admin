"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { isAdmin } from "../_axios/axiosInstance"; // Adjust the import path as necessary

const withProtectedRoute = (WrappedComponent) => {
  return (props) => {
    const router = useRouter(); // Get router instance

    useEffect(() => {
      // If the user is not an admin, redirect to the login page
      if (!isAdmin()) {
        router.push("/login");
      }
    }, [router]);

    // Render the WrappedComponent if the user is an admin
    return isAdmin() ? <WrappedComponent {...props} /> : null;
  };
};

export default withProtectedRoute;
