"use client";
import AuthForm from "@/components/AuthForm";
import { auth } from "@/auth";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import Loading from "@/components/Loading";


export default function SigninPage() {
  // const session = await getServerSession(authOptions);
  // const { data: session, status } = useSession();
  // const session = await auth();

  const router = useRouter();
  // const [loading, setLoading] = useState(false);
  // useEffect(() => {
  //   if (status === "authenticated") {
  //     router.push("/");

  //   } 
  // }, [status]);

  // if (status === "loading") {
  //   return <Loading />;
  // }

  const [errorMessage, setErrorMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleSignin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = form.get("email");

    const password = form.get("password");
    setErrorMessage("");

    // next auth
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
        setTimeout(() => router.push("/"), 1000);
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
