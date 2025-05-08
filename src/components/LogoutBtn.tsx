"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const LogoutButton = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await axios.post("/api/users/logout");
      console.log("Logged out successfully:", response.data);
      setShowToast(true); 
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "An unexpected error occurred during logout";

      setErrorMessage(message);
    }
  };

  return (
    <>
      <button
        onClick={handleLogout}
        className="btn btn-error text-white hover:btn-warning"
      >
        Logout
      </button>

      {/* Optional: Toast placeholder */}
      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Logged out successfully!</span>
          </div>
        </div>
      )}

      {/* Error display */}
      {errorMessage && (
        <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
      )}
    </>
  );
};
