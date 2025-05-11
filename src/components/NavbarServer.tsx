// Navbar.tsx (server component)
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import Navbar from "./Navbar";
// import NavbarClient from "./NavbarClient";

export default async function NavbarServer() {
  const session = await getServerSession(authOptions)
  console.log("Navbar: ",session)

//   return <NavbarClient session={session} />;
//   return <NavbarClient />;
return <Navbar session={session}></Navbar>


}
