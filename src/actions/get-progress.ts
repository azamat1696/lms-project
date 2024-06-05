import prisma from "@/lib/db";

export async function getProgress(
    userId: string,
    courseId: string
) : Promise<number> {
    try {
        const publishedChapters = await prisma.chapter.findMany({
            where: {
                courseId,
                isPublished: true,
            },
            select: {
                id: true,
            },
        });
        const publishedChaptersIds = publishedChapters.map((chapter:any) => chapter.id);
        const validCompletedChapters = await prisma.userProgress.count({
            where:{
                userId,
                chapterId: {
                    in: publishedChaptersIds,
                },
                isCompleted: true,
            }
        })
        //const progressPercentage =
        return (validCompletedChapters / publishedChapters.length) * 100;
    } catch (error) {
        console.log("[GET_PROGRESS]", error);
        return 0;
    }
}
