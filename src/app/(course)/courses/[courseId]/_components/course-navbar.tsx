import NavbarRoutes from "@/components/navbar-routes";
import { Chapter, Course, UserProgress } from "@prisma/client";
import React from "react";
import CourseMobileSidebar from "./course-mobile-sidebar";

type Props = {
    course: Course & {
        chapters: (Chapter & { userProgress: UserProgress[] | null })[];
    };
    progressCount: number;
};

const CourseNavbar: React.FC<Props> = ({ course, progressCount }) => {
    return (
        <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
            <CourseMobileSidebar course={course} progressCount={progressCount} />
            <NavbarRoutes />
        </div>
    );
};

export default CourseNavbar;
