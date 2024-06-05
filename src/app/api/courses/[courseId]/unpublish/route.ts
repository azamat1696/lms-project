import {NextResponse} from "next/server";
import prisma from "@/lib/db";
import {auth} from "@clerk/nextjs/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { courseId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const course = await prisma.course.findUnique({
        where: {
            id: courseId,
            userId,
        }
    });
    if (!course) {
        return new NextResponse("Course not found", { status: 404 });
    }
    const unPublishCourse = await prisma.course.update({
           where: {
                id: courseId,
                userId,
            },
            data: {
                isPublished: false,
            },
    })
    return NextResponse.json(unPublishCourse);
  } catch (error) {
    console.log("[COURSES_ID]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
