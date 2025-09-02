// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth-config";

// No v4 exporta diretamente NextAuth(authOptions)
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
