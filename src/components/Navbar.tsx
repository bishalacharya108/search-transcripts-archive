"use client";

import Link from "next/link";
import { LogoutButton } from "./LogoutBtn";
import { useSession } from "next-auth/react";
import { Suspense } from "react";
import Loading from "./Loading";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
export default function Navbar({ session }: { session: any }) {
  // const { data: session, status } = useSession(); // Get session data and status
  // console.log(session);
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
