"use client"
import Link from "next/link";
import { LogoutButton } from "./LogoutBtn";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import Image from "next/image";
import Navlinks from "./Navlinks";

export default  function Navbar({ session }: { session: any }) {
    // const session = await getServerSession(authOptions)
    return (
        <div className="navbar bg-base-100 shadow-sm fixed z-10 w-full">
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

                {/*TODO: There was probably some problem with using the className that needs fixing, this error only sometimes appeared*/}
                <Link href={"/"} className="text-xl ml-4">
                    <Image src={"/Logo.png"} alt="DharmaNation"
                        width={300}
                        height={300}
                        priority>
                    </Image>
                </Link>


                    <span className="pl-1 mt-1 text-xs align-bottom uppercase">Transcription</span>

            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1"><Navlinks session={session}></Navlinks></ul>
                <ul>
                    <li className="text-xs p-2">
                        <div className="flex">
                            <Image width={20} height={20} src={"/back.svg"} alt="back"></Image>
                            <a href="https://dharmacentral.com/" className="ml-1"> Return to Main Website</a>
                        </div>
                    </li>
                </ul>
            </div>
            {/* <a href="https://dharmacentral.com/" >Return to Main Website</a>*/}

            {
                // status === "authenticated" && (
                session && (

                    //TODO: add name of the user in the navbar?
                    <div className="navbar-end mr-2">
                        <div className="px-5 text-xs">
                            {session?.user?.userName}
                        </div>
                        <LogoutButton />
                    </div>
                )
            }
        </div>
    );
}
