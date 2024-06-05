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

        const unPublishedChapter = await prisma.chapter.update({
            where: {
                courseId: params.courseId,
                id: params.chapterId
            },
            data: {
                isPublished: false
            }
        })
        const publishedChaptersInCourse = await prisma.chapter.findMany({
            where: {
                courseId: params.courseId,
                isPublished: true
            }
        });
        if(!publishedChaptersInCourse.length){
            await prisma.course.update({
                where: {
                    id: params.courseId
                },
                data: {
                    isPublished: false
                }
            })
        }

        return NextResponse.json(unPublishedChapter);

    } catch (error) {
        console.log("[CHAPTER_UNPUBLISH]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }

}

