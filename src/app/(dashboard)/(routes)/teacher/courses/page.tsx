import prisma from "@/lib/db";
import {auth} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
export default async function CoursesPage(){
     const { userId } = auth();

     if (!userId) {
         return redirect("/");
     }

     const courses = await prisma.course.findMany({
         where: {
             userId,
         },
         orderBy: {
             createdAt: "desc",
         },
     });
    return (
        <div className="p-6">
            <DataTable columns={columns} data={courses} />
        </div>
    )
 }
