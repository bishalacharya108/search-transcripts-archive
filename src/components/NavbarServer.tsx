import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import Navbar from "./Navbar";


export default async function NavbarServer() {
  const session = await getServerSession(authOptions)
  // console.log("Navbar: ",session)


return <Navbar session={session}></Navbar>


}
