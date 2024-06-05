import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import {auth} from "@clerk/nextjs/server";
import {isTeacher} from "@/lib/teacher";

const f = createUploadthing();
const handleAuth = () => {
    const { userId } = auth();
    const isAuthorized = isTeacher(userId);
    if (!userId || !isAuthorized) throw new UploadThingError("Unauthorized");
    return { userId };

}
export const ourFileRouter = {
 courseImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
          .middleware(() => handleAuth())
          .onUploadComplete(() => {
                console.log("onUploadComplete");
          }),
     courseAttachment: f(["text", "image", "video", "audio", "pdf"])
          .middleware(() => handleAuth())
          .onUploadComplete(() => {}),
     chapterVideo: f({ video: { maxFileSize: "512GB", maxFileCount: 1 } })
          .middleware(() => handleAuth())
          .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
