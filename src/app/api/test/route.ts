import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req, secret });
  console.log("from test log:", token);

  // const cookieHeader = req.headers.get("cookie"); // fetch cookie manually
  // console.log(cookieHeader)
  return Response.json({ token });
}
