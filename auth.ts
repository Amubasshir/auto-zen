import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db/connect";
import User from "@/lib/db/models/User";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),

    Credentials({
      credentials: {
        name: { label: "Name", type: "text" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          await dbConnect();

          const user = await User.findOne({
            email: (credentials.email as string).toLowerCase(),
          }).select("+passwordHash");

          if (!user || !user.passwordHash) return null;

          const valid = await bcrypt.compare(
            credentials.password as string,
            user.passwordHash,
          );

          if (!valid) return null;

          return {
            id: user._id.toString(),
            name: user.name ?? "Learner",
            email: user.email,
            image: user.image ?? null,
          };
        } catch {
          return null;
        }
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async signIn({ user, account }) {
      // Upsert GitHub users into MongoDB on first OAuth login
      if (account?.provider === "github" && user.email) {
        try {
          await dbConnect();
          await User.findOneAndUpdate(
            { email: user.email.toLowerCase() },
            {
              $setOnInsert: {
                name: user.name,
                image: user.image,
                githubId: account.providerAccountId,
                startDate: new Date().toISOString().slice(0, 10),
              },
            },
            { upsert: true, new: true },
          );
        } catch {
          // Non-fatal: user can still sign in even if upsert fails
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === "github") {
          // GitHub user.id is GitHub's numeric ID — look up the MongoDB _id instead
          try {
            await dbConnect();
            const dbUser = await User.findOne({ email: user.email?.toLowerCase() });
            token.id = dbUser?._id.toString() ?? user.id;
          } catch {
            token.id = user.id;
          }
        } else {
          token.id = user.id;
        }
        token.name = user.name;
      }
      return token;
    },

    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name;
      }
      return session;
    },
  },
});
