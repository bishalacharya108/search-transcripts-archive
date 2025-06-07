"use client";

import { signOut } from "next-auth/react"; 

import { useState } from "react";

export const LogoutButton = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleLogout = async () => {
    try {
      // Using NextAuth.js to sign out
       await signOut({
        redirect: true,
        callbackUrl: "/signin",
      }); // Redirect to the sign-in page after logout

      // Show toast on successful logout
      setShowToast(true);
        // Clear the error message after 3 seconds
        setTimeout(() => {
          setErrorMessage(""); // Reset the error message after a delay
        }, 2000);
      
    } catch (error: unknown) {
         if (error instanceof Error) {
        // Check if the error is an instance of the built-in Error class
        setErrorMessage(error.message || "An unexpected error occurred during logout");
      } else {
        // Handle cases where error isn't an instance of Error
        setErrorMessage("An unexpected error occurred during logout");
      }

      // Clear the error message after 5 seconds
      setTimeout(() => {
        setErrorMessage(""); // Reset the error message after a delay
      }, 2000);
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

     
    </>
  );
};
