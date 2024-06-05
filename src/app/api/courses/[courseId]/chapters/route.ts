import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs/server";
import prisma from "@/lib/db";

export async function POST(
    req: Request,
    {params}: {params: {courseId: string}}
){
    try {
        const { userId } = auth();
        const { title } = await req.json();
        if (!userId) {
            return new NextResponse("Unauthorized", {status: 401})
        }
        const courseOwner = await prisma.course.findUnique({
            where: {
                id: params.courseId,
                userId,
            }
        });
        if (!courseOwner) {
            return new NextResponse("Unauthorized", {status: 401})
        }
        const lastChapter = await prisma.chapter.findFirst({
               where: {
                    courseId: params.courseId,
                },
                orderBy: {
                    position: "desc",
                }
        });
        const position = lastChapter ? lastChapter.position + 1 : 1;
        const chapter = await prisma.chapter.create({
            data: {
                title,
                courseId: params.courseId,
                position,
            }
        });
        return NextResponse.json(chapter);
    } catch (error) {
        console.log("[CourseIdPage] [POST] error", error);
        return new NextResponse("Something went wrong", {status: 500})
    }
}
