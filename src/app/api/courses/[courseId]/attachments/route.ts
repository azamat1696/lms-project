import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs/server";
import prisma from "@/lib/db";

export async function PATCH(
    req : Request,
    {params}: {params: {courseId: string}}
){
    try {
        const { userId } = auth();
        const { url } = await req.json();
        if (!userId) {
            return new NextResponse("Unauthorized", {status: 401})
        }
        const courseOwner = await prisma.course.findUnique({
            where: {
                id: params.courseId,
                userId,
            }
        });
        if (!courseOwner) {
            return new NextResponse("Unauthorized", {status: 401})
        }

        const attachments = await prisma.attachment.create({
            data: {
                url,
                name: url.split("/").pop(),
                courseId: params.courseId,
            }
        });
        return NextResponse.json(attachments);

    } catch (error) {
        console.log("[CourseIdPage] [POST] error", error);
        return new NextResponse("Something went wrong", {status: 500})
    }
}
