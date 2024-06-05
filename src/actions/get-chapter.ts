import prisma from "@/lib/db";
import { Attachment, Chapter } from "@prisma/client";

type Props = {
    userId: string;
    courseId: string;
    chapterId: string;
};

const getChapter = async ({ userId, courseId, chapterId }: Props) => {
    try {
        const purchase = await prisma.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                },
            },
        });

        const course = await prisma.course.findUnique({
            where: {
                id: courseId,
                isPublished: true,
            },
            select: {
                price: true,
            },
        });

        const chapter = await prisma.chapter.findUnique({
            where: {
                id: chapterId,
                isPublished: true,
            },
        });

        if (!chapter || !course) throw new Error("Chapter or Course not found");

        let muxData = null;
        let attachments: Attachment[] = [];
        let nextChapter: Chapter | null = null;

        if (purchase) {
            attachments = await prisma.attachment.findMany({
                where: {
                    courseId,
                },
            });
        }

        if (chapter.isFree || purchase) {
            muxData = await prisma.muxData.findUnique({
                where: {
                    chapterId,
                },
            });

            nextChapter = await prisma.chapter.findFirst({
                where: {
                    courseId,
                    isPublished: true,
                    position: {
                        gt: chapter?.position,
                    },
                },
                orderBy: {
                    position: "asc",
                },
            });
        }

        const userProgress = await prisma.userProgress.findUnique({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId,
                },
            },
        });

        return {
            chapter,
            course,
            muxData,
            attachments,
            nextChapter,
            userProgress,
            purchase,
        };
    } catch (error) {
        console.log("[GET CHAPTER ERROR]", error);
        return {
            chapter: null,
            course: null,
            muxData: null,
            attachments: [],
            nextChapter: null,
            userProgress: null,
            purchase: null,
        };
    }
};

export default getChapter;
