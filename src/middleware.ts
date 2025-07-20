import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req });
    const { pathname } = req.nextUrl;
    console.log("Middleware pathname hit: ", pathname);
    // Redirect logged-in users away from auth pages to the home page
    if (token && (pathname === "/signin" || pathname === "/register")) {
      const url = req.nextUrl.clone();
      url.pathname = "/"; // or "/dashboard"
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      async authorized({ token, req }) {
        const { pathname } = req.nextUrl;

        // Allow everyone to access signin and signup
        if (pathname === "/signin"  || pathname === "/register") {
          return true;
        }
        // Restrict /add to authenticated users only
        if (pathname.startsWith("/add")) {
          return !!token;
        }
        if (pathname.startsWith("/admin")) {
          return token?.role === "admin";
        }

        // Default: block access
        return false;
      },
    },
    pages: {
      signIn: "/signin",
    },
  }
);

export const config = {
  matcher: [ "/signin", "/register", "/add", "/admin/:path*"],
};
