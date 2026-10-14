import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getBoard } from "@/lib/boards";
import { KanbanBoard } from "@/components/workspace/kanban-board";
export default async function BoardPage({params}:{params:Promise<{boardId:string}>}){
 const {boardId}=await params;
 if(!/^[0-9a-f-]{36}$/i.test(boardId))notFound();
 const user=await requireUser();
 const board=await getBoard(boardId,user.id);
 if(!board)notFound();
 return <KanbanBoard key={boardId} initial={board} user={{...user,image:user.image??null}}/>;
}
