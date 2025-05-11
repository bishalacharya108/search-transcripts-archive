import "next-auth";
import { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

// creating this for the user in auth options (callback) in nextauth
declare module "next-auth" {
  interface User {
    _id?: string;
    isVerified?: boolean;
    userName?: string;
    role?: string;
  }
  interface Session {
    user: {
      _id?: string;
      isVerified?: boolean;
      userName?: string;
      role?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    _id?: string;
    isVerified?: boolean;
    userName?: string;
    role?: string;
  }
}
