import prisma from "@/lib/db";
import {Categories} from "@/app/(dashboard)/(routes)/search/_components/categories";
import {auth} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import {SearchInput} from "@/components/search-input";
import {getCourses} from "@/actions/get-courses";
import {CoursesList} from "@/components/courses-list";

interface Props {
    searchParams: {
        title: string;
        categoryId: string;
    };
}

export default async function SearchPage({searchParams} : Props) {
    const { userId } = auth();
    if (!userId) return redirect("/");
    const categories = await prisma.category.findMany({
        orderBy: {
            name: "asc",
        },
    });
    const courses = await getCourses({userId, ...searchParams});
    return (
        <>
            <div className="px-6 pt-6 md:hidden md:mb-0 block">
                 <SearchInput />
            </div>
            <div className="p-6 space-y-4">
                <Categories items={categories} />
               <CoursesList items={courses} />
            </div>
        </>
    );
}
