import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";

const handler = NextAuth({
    providers: [
        GitHubProvider({

        clientId: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),
    ],

    callbacks: {
        async session({ session, token }) {
            session.user.username = token.sub as string;
            return session;
        },

        async signIn({ profile }) {
            const allowed = process.env.ALLOWED_GITHUB_USERNAME;
            if (allowed && profile?.login !== allowed) return false;
            return true;
        },
    },
    pages:{
        signIn: "/login",
    },
});

export {handler as GET, handler as POST };
