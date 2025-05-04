"use client";
import AuthForm from "@/components/AuthForm";

export default async function RegisterPage() {
  const handleRegister = () => {
    return null;
  };
  return (
    <div className="hero bg-base-200 min-h-screen -mt-20">
      <AuthForm
        title={"Register"}
        buttonText="register"
        onSubmit={handleRegister}
        showName={true}
      ></AuthForm>
    </div>
  );
}
