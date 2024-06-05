import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";

const { video } = new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string } }
) {
    try {
        const { userId } = auth();
        const { isPublished, ...values } = await req.json();

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

        const chapter = await prisma.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId,
            },
            data: {
                ...values,
            },
        });

        if (values.videoUrl) {
            const existingMuxData = await prisma.muxData.findFirst({
                where: {
                    chapterId: params.chapterId,
                },
            });

            if (existingMuxData) {
                await video.assets.delete(existingMuxData.assetId);
                await prisma.muxData.delete({
                    where: {
                        id: existingMuxData.id,
                    },
                });
            }

            const asset = await video.assets.create({
                input: values.videoUrl,
                playback_policy: ["public"],
                test: false,
            });

            await prisma.muxData.create({
                data: {
                    assetId: asset.id,
                    chapterId: params.chapterId,
                    playbackId: asset.playback_ids?.[0]?.id,
                },
            });
        }

        return NextResponse.json(chapter);
    } catch (error) {
        console.log("[COURSES_ID]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string } }
) {
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

        if (!chapter) {
            return new NextResponse("Chapter not found", { status: 404 });
        }

        if (chapter.videoUrl) {
            const existingMuxData = await prisma.muxData.findFirst({
                where: {
                    chapterId: params.chapterId,
                },
            });

            if (existingMuxData) {
                await video.assets.delete(existingMuxData.assetId);
                await prisma.muxData.delete({
                    where: {
                        id: existingMuxData.id,
                    },
                });
            }
        }

        const deletedChapter = await prisma.chapter.delete({
            where: {
                id: params.chapterId,
            },
        });

        const publishedChapterInCourse = await prisma.chapter.findMany({
            where: {
                courseId: params.courseId,
                isPublished: true,
            },
        });

        if (!publishedChapterInCourse.length) {
            await prisma.course.update({
                where: {
                    id: params.courseId,
                },
                data: {
                    isPublished: false,
                },
            });
        }

        return NextResponse.json(deletedChapter);
    } catch (error) {
        console.log("[COURSES_ID]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
