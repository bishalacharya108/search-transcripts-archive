import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req });
    const { pathname } = req.nextUrl;

    // Redirect logged-in users away from auth pages
    if (token && (pathname === "/signin" || pathname === "/signup")) {
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
        if (pathname === "/signin" || pathname === "/signup") {
          return true;
        }

        // Restrict /add to authenticated users only
        if (pathname.startsWith("/add")) {
          return !!token;
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
  matcher: ["/signin", "/signup", "/add"],
};
