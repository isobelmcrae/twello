import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getInvitePreview } from "@/lib/boards";
import { AuthFrame } from "@/components/auth/auth-frame";
import { AcceptInvite } from "@/components/auth/accept-invite";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
export default async function InvitePage({params}:{params:Promise<{token:string}>}){
 const {token}=await params;
 const invite=await getInvitePreview(token);
 if(!invite)return <AuthFrame title="This invitation has expired" description="The link may have expired or been revoked. Ask the board owner for a new invitation."><Button asChild variant="outline"><Link href="/">Go to your boards</Link></Button></AuthFrame>;
 const session=await auth.api.getSession({headers:await headers()});
 const mismatch=invite.email&&session?.user&&session.user.email.toLowerCase()!==invite.email.toLowerCase();
 return <AuthFrame title={`You're invited to ${invite.title}`} description="Join your team on this board.">
  <div className="flex flex-col gap-5">
   <div className="flex items-center gap-2"><Badge variant="secondary">{invite.role}</Badge><span className="text-sm text-muted-foreground">{invite.role==="editor"?"Create, move, and edit tasks":"View tasks and board activity"}</span></div>
   {invite.email&&<p className="text-sm text-muted-foreground">This invitation is for {invite.email}.</p>}
   <p className="text-sm text-muted-foreground">Expires {new Date(invite.expiresAt).toLocaleDateString("en-AU",{dateStyle:"long",timeZone:"UTC"})}.</p>
   {mismatch?<><Alert><AlertDescription>You're signed in as {session?.user.email}. Sign out, then use {invite.email} to accept this invitation.</AlertDescription></Alert><Button variant="outline" asChild><Link href="/">Back to workspace</Link></Button></>:session?.user.emailVerified?<AcceptInvite token={token}/>:<Button asChild><Link href={`/login?next=${encodeURIComponent(`/invite/${token}`)}`}>Sign in or create an account</Link></Button>}
  </div>
 </AuthFrame>;
}
