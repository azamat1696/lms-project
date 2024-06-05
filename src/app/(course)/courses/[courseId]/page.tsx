import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
    params: { courseId: string };
};

const CourseIdPage: React.FC<Props> = async ({ params }) => {
    const course = await prisma.course.findUnique({
        where: {
            id: params.courseId,
        },
        include: {
            chapters: {
                where: {
                    isPublished: true,
                },
                orderBy: {
                    position: "asc",
                },
            },
        },
    });

    if (!course) redirect("/");

    return redirect(`/courses/${course.id}/chapters/${course.chapters[0].id}`);
};

export default CourseIdPage;
