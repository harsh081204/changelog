import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: { signIn: "/login" },
});

export const config = {
  // Everything under /dashboard requires auth
  matcher: ["/dashboard/:path*"],
};
