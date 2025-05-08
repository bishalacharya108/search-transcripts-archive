"use client";
import AuthForm from "@/components/AuthForm";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const handleLogin = async (e: any) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = form.get("email");
  
    const password = form.get("password");
    setErrorMessage("");
    try {
      const response = await axios.post("/api/users/login", {
        email,
        password,
      });

      console.log("Logged in successfully:", response.data);
      setTimeout(() => {
        setShowToast(true);
        router.push("/");
      }, 2000);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "An unexpected error occurred during user login";

      setErrorMessage(message);
    }
  };

  return (
    <div className="hero bg-base-200 min-h-screen -mt-20">
      <AuthForm
        onSubmit={handleLogin}
        title="Login"
        buttonText="login"
        errorMessage = {errorMessage}
        
      ></AuthForm>
      {showToast && (
        <div className="toast toast-top toast-center z-50">
          <div className="alert alert-success">
            <span>Login successful!</span>
          </div>
        </div>
      )}
    </div>
  );
}
