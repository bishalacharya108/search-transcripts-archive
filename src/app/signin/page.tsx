"use client";
import AuthForm from "@/components/AuthForm";
import { auth } from "@/auth";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import Loading from "@/components/Loading";
// import { revalidatePath } from "next/cache";


export default function SigninPage() {
    const router = useRouter();

    const [errorMessage, setErrorMessage] = useState("");
    const [showToast, setShowToast] = useState(false);

    const handleSignin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const email = form.get("email");

        const password = form.get("password");
        setErrorMessage("");

        // using next auth signin function
        try {
            const res = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (!res) {
                setErrorMessage("No response from authentication server.");
            } else if (res.error) {
                setErrorMessage(res.error);
            } else {
                setShowToast(true);
                // revalidatePath("/");
                setTimeout(() =>
                    // Revalidate the path to ensure the session is up to date
                    router.push("/"), 1000);
            }
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
                onSubmit={handleSignin}
                title="signin"
                buttonText="signin"
                errorMessage={errorMessage}
            ></AuthForm>
            <Suspense fallback={<Loading />}>
                {showToast && (
                    <div className="toast toast-top toast-center z-50">
                        <div className="alert alert-success">
                            <span>signin successful!</span>
                        </div>
                    </div>
                )}
            </Suspense>
        </div>
    );
}
