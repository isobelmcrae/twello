import Link from "next/link";
import { AuthFrame } from "@/components/auth/auth-frame";
import { Button } from "@/components/ui/button";
export default function VerifyEmail(){return <AuthFrame title="Check your inbox" description="Open your verification email to confirm your account."><Button variant="outline" asChild><Link href="/login">Back to sign in</Link></Button></AuthFrame>}
