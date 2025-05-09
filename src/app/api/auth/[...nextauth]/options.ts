// will use options in the route.ts
import bcryptjs from "bcryptjs";
import { User } from "./../../../../modules/users/user.model";
import connectDB from "@/config/db";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "text", placeholder: "your-email" },
        password: { label: "Password", type: "password" },
      },

      // my authorize logic
      async authorize(credentials: any, req: any): Promise<any> {
        await connectDB();
        try {
          console.log(credentials.email, credentials.password);
          // 🔧 VALIDATION: check if both fields exist
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Missing email/username or password");
          }

          const user = await User.findOne({
            $or: [
              { email: credentials.email },
              
            ],
          });

          if (!user) {
            throw new Error("User not found");
          }

          // Optional: verify user
          // if (!user.isVerified) {
          //   throw new Error("User is not verified");
          // }

          const isPasswordCorrect = await bcryptjs.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordCorrect) {
            throw new Error("Invalid credentials");
          }

          // 🔧 CLEAN RETURN: only return what's needed (recommended)
          return {
            _id: user._id.toString(),
            userName: user.userName,
            isVerified: user.isVerified,
            email: user.email,
            role: user.role || "user",
          };
        } catch (error: any) {
          console.error("Authorize error:", error.message); // 🔧 LOG ERROR
          throw new Error(error.message || "Login failed");
        }
      },
    }),
  ],
  pages: {
    // for now I don't need it
    // if any page is needed to be override we will override here
  },

  
  callbacks: {

    // why am I using both session and jwt
    // session is used for server side rendering
    // jwt is used for client side rendering
    // minimizing network requests

    // session will recieve the user from authorize method and then this user will be available in jwt via session
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.userName = token.userName;
        session.user.role = token.role
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        // have to create partial types for this
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.userName = user.userName;
        token.role = user.role
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      // return baseUrl;
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  session: {
    strategy: "jwt", // we can use db or jwt, using jwt for now
  },
  secret: process.env.NEXT_SECRET,
};
