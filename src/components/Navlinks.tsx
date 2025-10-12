"use client"
import { Suspense } from "react";
import Loading from "./Loading";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navlinks({ session }: { session: any }) {
    //TODO: only authorized users will have access to upload page
    const pathname = usePathname()
    const isActive = (href: string) => {
        return pathname === href ? "text-black font-semibold bg-[#F8B447]" : "";
    }

    return (
        <>
            {
                /*
                    
                    */
                <li>
                    <Link href={"/"} className={isActive("/")}>Home</Link>
                </li>
            }

            {session &&
                <li>
                    <Link href={"/add"} className={isActive("/add")}>Upload Transcripts</Link>
                </li>
            }
            {/* next auth based links */}
            <Suspense fallback={<Loading />}>
                {
                    // status === "unauthenticated" && (
                    !session && (
                        <>
                            <li>
                                <Link href="/signin" className={isActive("/signin")}>Signin</Link>
                            </li>
                            <li>
                                <Link href="/register" className={isActive("/register")}>Register</Link>
                            </li>
                        </>
                    )
                }
            </Suspense>

            <li>
                <Link href={"/about"} className={isActive("/about")}>About</Link>
            </li>
            {
                session?.user?.role === 'admin' &&
                <li>
                    <Link href={"/admin"} className={isActive("/admin")}>Admin Panel</Link>
                </li>
            }

            <li>
                <Link href="/search" className={isActive("/search")}>Search</Link>
            </li>
        </>
    )
}

