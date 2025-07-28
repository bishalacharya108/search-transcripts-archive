"use client";

import Link from "next/link";
import { LogoutButton } from "./LogoutBtn";
import { useSession } from "next-auth/react";
import { Suspense, useState } from "react";
import Loading from "./Loading";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import axios from "axios";
export default function Navbar({ session }: { session: any }) {
    // const { data: session, status } = useSession(); // Get session data and status
    const [searchValue, setSearchValue] = useState();
    const handleSearchInput = (e) => {
        setSearchValue(e.target.value)

    }
    const handleSearchSubmit = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        try {
            const response = await axios.get("http://localhost:3000/api/search/", {
                params: {
                    searchValue
                }
            });
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }
    const links = (
        <>
            <li>
                <Link href={"/"}>Home</Link>
            </li>
            <li>
                <Link href={"/add"}>Add Transcripts</Link>
            </li>
            {/* next auth based links */}
            <Suspense fallback={<Loading />}>
                {
                    // status === "unauthenticated" && (
                    !session && (
                        <>
                            <li>
                                <Link href="/signin">Signin</Link>
                            </li>
                            <li>
                                <Link href="/register">Register</Link>
                            </li>
                        </>
                    )
                }
            </Suspense>

            <li>
                <Link href={"/about"}>About</Link>
            </li>
            <li>
                <Link href="/admin">Admin Panel</Link>
            </li>
        </>
    );
    return (
        <div className="navbar bg-base-100 shadow-sm">
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
                        {links}
                    </ul>
                </div>
                <Link href={"/"} className="btn btn-ghost text-xl">
                    ISDS
                </Link>

                <div className="flex">
                    <label className="input">
                        <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <g
                                strokeLinejoin="round"
                                strokeLinecap="round"
                                strokeWidth="2.5"
                                fill="none"
                                stroke="currentColor"
                            >
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.3-4.3"></path>
                            </g>
                        </svg>
                        <input type="search" value={searchValue} onChange={handleSearchInput} required placeholder="Search Word" />
                    </label>
                    <button onClick={handleSearchSubmit} className="btn btn-outline">Search</button>
                </div>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">{links}</ul>
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
