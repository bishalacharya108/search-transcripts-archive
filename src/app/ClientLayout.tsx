// This file is used to wrap the app with the SessionProvider
// and make the session available to all components
// rn it is not in use anywhere
"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
