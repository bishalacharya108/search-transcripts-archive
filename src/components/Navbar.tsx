import Link from "next/link";
import { LogoutButton } from "./LogoutBtn";
import { Suspense } from "react";
import Loading from "./Loading";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import Image from "next/image";
import Navlinks from "./Navlinks";

export default async function Navbar() {

    const session = await getServerSession(authOptions)
    return (
        <div className="navbar bg-base-100 shadow-sm fixed z-10 w-5xl">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            {" "}
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h8m-8 6h16"
                            />{" "}
                        </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
                    >
                    <Navlinks session={session}></Navlinks>
                    </ul>

                </div>
                <Link href={"/"} className="text-xl">
                    <Image src={"/Logo.png"} alt="DharmaNation"
                        width={300}
                        height={300}
                        priority  ></Image>
                </Link>

            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1"><Navlinks session={session}></Navlinks></ul>
            </div>
            <Suspense fallback={<Loading />}>
                {
                    // status === "authenticated" && (
                    session && (
                        <div className="navbar-end">
                            <LogoutButton />
                        </div>
                    )
                }
            </Suspense>
        </div>
    );
}
