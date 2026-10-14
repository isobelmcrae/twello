import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AuthFrame } from "@/components/auth/auth-frame";
import { LoginForm } from "@/components/auth/login-form";
import { safeNextPath } from "@/lib/navigation";

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const nextPath = safeNextPath(params.next);
  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user.emailVerified) redirect(nextPath);
  return <AuthFrame title="Your team. On the same board." description="Sign in to your workspace or make an account." footer={process.env.PREVIEW_EMAIL_INBOX === "true" ? <p className="text-sm text-muted-foreground">Preview emails appear in the <a href="/preview-inbox/" target="_blank" rel="noreferrer" className="underline">shared test inbox</a>.</p> : undefined}><LoginForm nextPath={nextPath} /></AuthFrame>;
}
