import { auth } from '@clerk/nextjs/server';
import {redirect} from "next/navigation";
import prisma from "@/lib/db";
import {IconBadge} from "@/components/icon-badge";
import {CircleDollarSign, LayoutDashboard, ListChecks, File} from "lucide-react";
import TitleForm from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/title-form";
import DescriptionForm from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/description-form";
import ImageForm from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/image-form";
import CategoryForm from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/category-form";
import PriceForm from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/price-form";
import AttachmentForm from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/attachment-form";
import ChapterForm from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/chapters-form";
import ChaptersForm from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/chapters-form";
import Banner from "@/components/banner";
import {CourseActions} from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/courser-actions";

export default async function CoursePage({params}: {params: {courseId: string}}){
    const { userId } = auth();
    if (!userId) {
       return  redirect("/");
    }
    const course = await prisma.course.findUnique({
        where: {
            id: params.courseId,
            userId,
        },
        include: {
            chapters: {
                orderBy: {
                    position: "asc",
                },
            },
            attachments: {
                orderBy: {
                    createdAt: "desc",
                },
            },
        },
    })

    const categories = await prisma.category.findMany({
        orderBy: {
            name: "asc",
        },
    });
    if (!course) {
        return redirect("/");
    }
    const requiredFields = [
        course.title,
        course.description,
        course.imageUrl,
        course.price,
        course.categoryId,
        course.chapters.some((chapter) => chapter.isPublished),
    ];
    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    const completionText = `(${completedFields}/${totalFields})`;

    const isComplete = requiredFields.every(Boolean);
    return (
        <>
            {
                !course.isPublished && (
                    <Banner
                        variant="warning"
                        label="This course is unpublished. It will not be visible to students."
                    />
                )
            }
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-2">
                        <h1 className="text-2xl font-medium">Course Setup</h1>
                        <span className="text-sm text-slate-700">
                    Complete all fields {completionText}
            </span>
                    </div>
            <CourseActions
                disabled={!isComplete}
                courseId={params.courseId}
                isPublished={course.isPublished}
            />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div className="">
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={LayoutDashboard} size="default"/>
                            <h2 className="text-xl">Customize your course</h2>
                        </div>
                        <TitleForm initialData={course} courseId={course.id}/>
                        <DescriptionForm initialData={course} courseId={course.id}/>
                        <ImageForm initialData={course} courseId={course.id}/>
                        <CategoryForm
                            initialData={course}
                            courseId={course.id}
                            options={categories.map((category) => ({
                                    label: category.name,
                                    value: category.id
                                })
                            )}
                        />
                    </div>
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={ListChecks} size="default"/>
                                <h2 className="text-xl">Course chapters</h2>
                            </div>
                            <ChaptersForm initialData={course} courseId={course.id}/>
                        </div>
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={CircleDollarSign} size="default"/>
                                <h2 className="text-xl">Sell your course</h2>
                            </div>
                            <div>
                                <PriceForm initialData={course} courseId={course.id}/>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={File} size="default"/>
                                <h2 className="text-xl">Resource & Attachment</h2>
                            </div>
                            <div>
                                <AttachmentForm initialData={course} courseId={course.id}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}
