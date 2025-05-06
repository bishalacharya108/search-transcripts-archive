"use client";
import AuthForm from "@/components/AuthForm";
import { useState } from "react";

export default async function LoginPage() {
  const [errorMessage, setErrorMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const handleLogin = () => {
    return null;
  };
  return (
    <div className="hero bg-base-200 min-h-screen -mt-20">
      <AuthForm
        onSubmit={handleLogin}
        title="Login"
        buttonText="login"
        errorMessage = {errorMessage}
        showToast
      ></AuthForm>
    </div>
  );
}
