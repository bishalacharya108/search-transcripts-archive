"use client";
import AuthForm from "@/components/AuthForm";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState("");
    const [showToast, setShowToast] = useState(false);

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const email = form.get("email");
        const userName = form.get("name");
        const password = form.get("password");
        setErrorMessage("");
        try {
            await axios.post("/api/users/signup", {
                email,
                userName,
                password,
            });

            setShowToast(true);
            setTimeout(() => {
                router.push("/signin");
            }, 2000);
        } catch (error: any) {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "An unexpected error occurred during signup.";

            setErrorMessage(message);
        }
    };


    return (
        <div className="hero bg-base-200 min-h-screen -mt-20">
            <AuthForm
                title={"Register"}
                buttonText="register"
                onSubmit={handleRegister}
                showName={true}
                errorMessage={errorMessage}
            ></AuthForm>
            {showToast && (
                <div className="toast toast-top toast-center z-50">
                    <div className="alert alert-success">
                        <span>Registration successful!</span>
                    </div>
                </div>
            )}
        </div>
    );
}
