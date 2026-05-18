import { classifyChanges } from "../lib/llm/classifier";

const fakePR = {
  prTitle: "Add Google OAuth login and fix button loading state",
  prDescription: "Users can now sign in with Google. Also fixed the button flickering on slow connections.",
  diffText: `
### src/auth/login.ts (+45 -12)
+ export async function loginWithGoogle(token: string) {
+   const user = await verifyGoogleToken(token)
+   if (!user) throw new Error("Invalid token")
+   return createSession(user.id)
+ }
- export async function loginWithEmail(email: string, password: string) {
+ export async function loginWithEmail(email: string, password: string): Promise<Session> {
    const user = await db.user.findUnique({ where: { email } })
    if (!user) throw new Error("User not found")
    return createSession(user.id)
  }

### src/components/Button.tsx (+3 -8)
- className={isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
+ className={cn("transition-opacity duration-150", {
+   "opacity-50 cursor-not-allowed": isLoading,
+   "cursor-pointer": !isLoading
+ })}
  `.trim(),
};

async function main() {
  console.log("Sending to Groq...\n");

  const result = await classifyChanges(fakePR);

  console.log("Result:");
  console.log(JSON.stringify(result, null, 2));
}

main().catch(console.error);