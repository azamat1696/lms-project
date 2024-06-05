import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs/server";
import prisma from "@/lib/db";

export async function DELETE(
    req : Request,
    {params}: {params: {courseId: string, attachmentId: string}}
){
    try {
      const { userId } = auth();
      if (!userId) {
            return new NextResponse("Unauthorized", {status: 401})
      }
        const { attachmentId,courseId } = params;
      const courseOwner = await prisma.course.findUnique({
          where: {
              id: courseId,
              userId
          }
      })
      if (!courseOwner){
          return new NextResponse("Unauthorized",{status: 401})
      }
      const attachment = await prisma.attachment.delete({
          where:{
              courseId,
              id: attachmentId
          }
      })
      return NextResponse.json(attachment);
    } catch (error) {
        console.log("[CourseIdPage] [POST] error", error);
        return new NextResponse("Something went wrong", {status: 500})
    }
}
