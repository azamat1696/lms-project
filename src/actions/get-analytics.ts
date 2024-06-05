import prisma from "@/lib/db";
import { Course, Purchase } from "@prisma/client";

type PurchaseWithCourse = Purchase & {
    course: Course;
};

const groupByCourse = (purchases: PurchaseWithCourse[]) => {
    const grouped: { [courseTitle: string]: number } = {};

    purchases.forEach((purchase) => {
        const courseTitle = purchase.course.title;

        if (!grouped[courseTitle]) {
            grouped[courseTitle] = 0;
        }

        grouped[courseTitle] += purchase.course.price!;
    });

    return grouped;
};

export const getAnalytics = async (userId: string) => {
    try {
        const purchases = await prisma.purchase.findMany({
            where: {
                course: {
                    userId: userId,
                },
            },
            include: {
                course: true,
            },
        });

        const groupedEarnings = groupByCourse(purchases);
        const data = Object.entries(groupedEarnings).map(
            ([courseTitle, total]) => ({
                name: courseTitle,
                total,
            })
        );

        const totalRevanue = data.reduce((acc, curr) => acc + curr.total, 0);
        const totalSales = purchases.length;

        return {
            data,
            totalRevanue,
            totalSales,
        };
    } catch (error) {
        console.log("[GET ANALYTICS ERROR]", error);
        return {
            data: [],
            totalRevanue: 0,
            totalSales: 0,
        };
    }
};
