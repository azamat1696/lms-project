import {NextResponse} from "next/server";
import prisma from "@/lib/db";
import {isTeacher} from "@/lib/teacher";
import {auth} from "@clerk/nextjs/server";

import Mux from "@mux/mux-node";

const { video } = new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function PATCH(
    req : Request,
    {params} : {params: {courseId: string}}
){
    try {
        const { userId } = auth();
        const { courseId } = params;
        const values = await req.json();
        if (!userId || !isTeacher(userId)) {
            return new NextResponse("Unauthorized", {
                status: 401
            });
        }
        const course = await prisma.course.update({
            where: {
                id: courseId,
                userId
            },
            data: {
                ...values
            }
        });
        return NextResponse.json(course,{status: 200});
    } catch (error) {
        console.log("[COURSES]", error);
        return new NextResponse("Internal Server Error", {
            status: 500
        });
    }

}

export async function DELETE(
     req: Request,
     { params }: { params: { courseId: string } }
){
    try {
        const { userId } = auth();
        const { courseId } = params;
        if (!userId || !isTeacher(userId)) {
            return new NextResponse("Unauthorized", {
                status: 401
            });
        }
        const course = await prisma.course.findUnique({
            where: {
                id: courseId,
                userId
            },
            include: {
                chapters: {
                    include: {
                        muxData: true
                    }
                },
            }
        });
        if (!course) {
            return new NextResponse("Course not found", {
                status: 404
            });
        }
        for (const chapter of course.chapters) {
            if (chapter.videoUrl) {
                const existingMuxData = await prisma.muxData.findFirst({
                    where: {
                        chapterId: chapter.id
                    }
                });
                if (existingMuxData) {
                    await video.assets.delete(existingMuxData.assetId);
                    await prisma.muxData.delete({
                        where: {
                            id: existingMuxData.id
                        }
                    });
                }
            }
        }
        const deleteCourse = await prisma.course.delete({
            where: {
                id: courseId
            }
        });
        return NextResponse.json(deleteCourse);
    } catch (error) {
        console.log("[COURSES_DELETE]", error);
        return new NextResponse("Internal Server Error", {
            status: 500
        });
    }
}
