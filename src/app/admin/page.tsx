import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/options";

export default async function AdminPanel() {
  const session = await getServerSession(authOptions);
  if(!session){
    return null;
  }
  return (
    <div className="hero bg-base-200 min-h-screen -mt-20">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Admin Panel</h1>
          <p className="py-6">This is the admin panel.</p>
          {
            session? <p className="py-6 bg-blue-400">Welcome Admin</p>: <p className="py-6 bg-red-400">Only admin can access this page</p>
          }
        </div>
      </div>
    </div>
  )}
    