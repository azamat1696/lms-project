import React from "react";
import { Category, Course } from "@prisma/client";
import {CourseCard} from "@/components/course-card";

type CourseWithProgressWithCategory = Course & {
    category: Category | null;
    chapters: { id: string }[];
    progress: number | null;
};

type Props = {
    items: CourseWithProgressWithCategory[];
};

const CoursesList: React.FC<Props> = ({ items }) => {
    return (
        <div>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {items.map((item) => (
                    <CourseCard
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        imageUrl={item.imageUrl!}
                        chaptersLength={item.chapters.length}
                        price={item.price!}
                        category={item?.category?.name!}
                        progress={item.progress}
                    />
                ))}
            </div>
            {items.length === 0 && (
                <div className="text-center text-sm text-muted-foreground mt-10">
                    No courses found
                </div>
            )}
        </div>
    );
};

export default CoursesList;
