import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/config/mongoDB";
import { Adapter } from "next-auth/adapters";
import { ObjectId } from "mongodb";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise) as Adapter,
  // callbacks: {
  //   async session({ session, token, user }: any) {

  //   },
  //   async signIn({ user, account, profile, email, credentials }: any) {

  //   },
  // },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
