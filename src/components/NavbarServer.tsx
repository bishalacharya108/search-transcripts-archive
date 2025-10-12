import { getServerSession } from "next-auth";
import Navbar from "./Navbar";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

//  created this for testing purposes
export default async function NavbarServer() {

    const session = await getServerSession(authOptions)
    return (
            <Navbar session= {session}></Navbar>
        // <SessionProvider session={session}><Navbar ></Navbar></SessionProvider>
    )
}
