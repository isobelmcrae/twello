import { betterAuth } from "better-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { pool } from "@/lib/db";
import { sendMail } from "@/lib/mail";
import { getAppUrl } from "@/lib/app-url";

export const getAuth = cache(async () => betterAuth({
  appName: "Twello",
  baseURL: await getAppUrl(),
  secret: process.env.BETTER_AUTH_SECRET,
  database: pool,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 10,
    requireEmailVerification: true,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      await sendMail({ to: user.email, subject: "Reset your Twello password", heading: "Reset your password", body: "Choose a new password for your Twello account.", url, action: "Reset password", detail: "This link expires in one hour." });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    expiresIn: 3600,
    sendVerificationEmail: async ({ user, url }) => {
      await sendMail({ to: user.email, subject: "Verify your Twello email", heading: "Verify your email", body: "Confirm your email address to start making boards and accept invitations.", url, action: "Verify email", detail: "This link expires in one hour." });
    },
  },
  rateLimit: { enabled: true, storage: "database", window: 60, max: 60 },
  session: { expiresIn: 60 * 60 * 24 * 14, updateAge: 60 * 60 * 24 },
}));

export async function getSession() {
  const requestHeaders = await headers();
  if (!requestHeaders.get("cookie")) return null;
  return (await getAuth()).api.getSession({ headers: requestHeaders });
}

export async function requireUser() {
  const session = await getSession();
  if (!session?.user.emailVerified) throw new Error("Sign in with a verified email to continue.");
  return session.user;
}

export async function requirePageUser() {
  const session = await getSession();
  if (!session?.user.emailVerified) redirect("/login");
  return session.user;
}
