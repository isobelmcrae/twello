import Link from "next/link";
import { AuthFrame } from "@/components/auth/auth-frame";
import { PasswordForm } from "@/components/auth/password-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
export default async function ResetPassword({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
 const params=await searchParams;
 return <AuthFrame title="Choose a new password" description="Use at least 10 characters.">{typeof params.token==="string"&&!params.error?<PasswordForm token={params.token}/>:<Alert><AlertDescription>This reset link is invalid or has expired. <Link href="/forgot-password" className="underline">Request another link.</Link></AlertDescription></Alert>}</AuthFrame>;
}
