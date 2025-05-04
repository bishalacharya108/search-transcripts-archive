"use client"
import AuthForm from "@/components/AuthForm";

export default async function LoginPage() {
    const handleLogin =() =>{
        return null
    }
    return (
        
      <div className="hero bg-base-200 min-h-screen -mt-20">
        <AuthForm onSubmit={handleLogin} title="Login" buttonText="login"></AuthForm>
      </div>
    );
  }
  