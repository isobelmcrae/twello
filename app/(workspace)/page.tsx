import { requireUser } from "@/lib/auth";
import { listBoards } from "@/lib/boards";
import { Dashboard } from "@/components/workspace/dashboard";
export default async function Home(){
 const user=await requireUser();
 return <Dashboard user={{...user,image:user.image??null}} boards={await listBoards(user.id)}/>;
}
