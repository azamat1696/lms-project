import { Chapter, Course, UserProgress } from "@prisma/client";
import { Menu } from "lucide-react";
import React from "react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import CourseSidebar from "./course-sidebar";

type Props = {
    course: Course & {
        chapters: (Chapter & { userProgress: UserProgress[] | null })[];
    };
    progressCount: number;
};

const CourseMobileSidebar: React.FC<Props> = ({ course, progressCount }) => {
    return (
        <Sheet>
            <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
                    <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-white w-72">
                <CourseSidebar course={course} progressCount={progressCount} />
            </SheetContent>
        </Sheet>
    );
};

export default CourseMobileSidebar;
