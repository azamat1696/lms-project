import {Category, Course} from "@prisma/client";
import {getProgress} from "@/actions/get-progress";
import prisma from "@/lib/db";


type CourseWithProgressWithCategory = Course & {
    category: Category | null;
    chapters: { id: string }[];
    progress: number | null;
};

type GetCourses = {
    userId: string;
    title?: string;
    categoryId?: string;
};
export async function getCourses({userId, title, categoryId}: GetCourses): Promise<CourseWithProgressWithCategory[]> {
    try {
        const courses = await prisma.course.findMany({
            where: {
                isPublished: true,
                title: {
                    contains: title
                },
                categoryId
            },
            include: {
                category: true,
                chapters: {
                     where:{
                        isPublished: true
                     },
                        select: {
                            id: true
                        }
                },
                purchases: {
                    where: {
                        userId
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return await
            Promise.all(courses.map(async (course: any) => {
                if (course.purchases.length === 0) {
                    return {
                        ...course,
                        progress: null
                    }
                }
                const progressPercentage = await getProgress(userId, course.id);
                return {
                    ...course,
                    progress: progressPercentage
                }
            }));
    } catch (error) {
        console.log("[GET_COURSES]", error);
        return [];
    }

}
