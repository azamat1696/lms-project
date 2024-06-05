import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs/server";
import prisma from "@/lib/db";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string, chapterId:string } }
){
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const courseOwner = await prisma.course.findUnique({
            where: {
                id: params.courseId,
                userId,
            },
        });
        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const chapter = await prisma.chapter.findUnique({
                where: {
                    id: params.chapterId,
                    courseId: params.courseId,
                },
            });

        const muxData = await prisma.muxData.findFirst({
            where: {
                chapterId: params.chapterId,
            },
        });

        if(!chapter || !muxData || !chapter.videoUrl || !chapter.title || !chapter.description){
            return new NextResponse("Missing required fields", { status: 400 });
        }
        const publishedChapter = await prisma.chapter.update({
            where: {
                courseId: params.courseId,
                id: params.chapterId
            },
            data: {
                isPublished: true
            }
        })
        return NextResponse.json(publishedChapter);

    } catch (error) {
        console.log("[CHAPTER_UPDATE]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }

}
