import {NextResponse} from "next/server";
import prisma from "@/lib/db";
import {auth} from "@clerk/nextjs/server";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const { userId } = auth();
        const { courseId } = params;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const course = await prisma.course.findUnique({
            where: {
                id: courseId,
                userId,
            },
            include:{
                chapters: {
                    include: {
                        muxData: true,
                    }
                }
            }
        });
        if (!course) {
            return new NextResponse("Course not found", { status: 404 });
        }
        const hasPublishedChapters = course.chapters.some(chapter => chapter.isPublished);
        if (!course.title || !course.description || !course.imageUrl || !course.categoryId || !hasPublishedChapters) {
            return new NextResponse("Missing required fields", { status: 400 });
        }
        const publishCourse = await prisma.course.update({
            where: {
                id: courseId,
                userId,
            },
            data: {
                isPublished: true,
            },
        })
        return NextResponse.json(publishCourse);
    } catch (error) {
        console.log("[COURSES_ID]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
