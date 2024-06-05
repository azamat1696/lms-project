import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import { isTeacher } from "@/lib/teacher";

export async function POST(
    req: Request,
){
    try {
     const { userId } = auth();
     const { title } = await req.json();
        if (!userId || !isTeacher(userId)) {
            return new NextResponse("Unauthorized", {status: 401});
        }
     const course = await prisma.course.create({
            data: {
                title,
                userId
            },
        });
        return NextResponse.json(course, {status: 201});
    } catch (error) {
        console.log("[COURSES]", error);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}
