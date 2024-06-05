import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
export async function PUT(
    req: Request,
    { params }: { params: { courseId: string } }
) {
     try {
        const { userId } = auth();
        const { list } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const ownerCourse = await prisma.course.findUnique({
            where: {
                id: params.courseId,
                userId,
            },
        });


        if (!ownerCourse) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        for (let item of list) {
            await prisma.chapter.update({
                where: { id: item.id },
                data: { position: item.position },
            });
        }

        return NextResponse.json("Success", { status: 200 });
    } catch (error) {
        console.log("[CHAPTERS_REORDER]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
