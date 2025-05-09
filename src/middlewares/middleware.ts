import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const {pathname} = req.nextUrl;


        // allow auth related routes
        if (pathname.startsWith("/api/auth") || pathname === "/signin" || pathname === "/register") {
            return true;
        }

        // allow public routes
        if(pathname === "/"){
            return true;
        }

        // admin routes
        if(pathname.startsWith("/admin")){
            return token?.role === "admin";
        }

        // all other routes require authentication
        return !!token;
      }
    },
  },
)

// export const config = { matcher: ["/admin"] }