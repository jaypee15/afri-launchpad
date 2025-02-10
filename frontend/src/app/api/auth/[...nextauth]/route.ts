import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import TwitterProvider from "next-auth/providers/twitter";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { compare } from "bcryptjs";

const providers = [
  CredentialsProvider({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        throw new Error("Invalid credentials");
      }

      const client = await clientPromise;
      const db = client.db();
      const user = await db.collection("users").findOne({ email: credentials.email });

      if (!user || !user.password) {
        throw new Error("User not found");
      }

      const isValid = await compare(credentials.password, user.password);

      if (!isValid) {
        throw new Error("Invalid password");
      }

      if (!user.emailVerified) {
        throw new Error("Please verify your email first");
      }

      return {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      };
    },
  }),
  GoogleProvider({
    clientId: process.env.GOOGLE_ID!,
    clientSecret: process.env.GOOGLE_SECRET!,
  }),
  TwitterProvider({
    clientId: process.env.TWITTER_ID!,
    clientSecret: process.env.TWITTER_SECRET!,
    version: "2.0",
  }),
  FacebookProvider({
    clientId: process.env.FACEBOOK_ID!,
    clientSecret: process.env.FACEBOOK_SECRET!,
  }),
];

const handler = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify",
    error: "/auth/error",
  },
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
});

export { handler as GET, handler as POST }; 