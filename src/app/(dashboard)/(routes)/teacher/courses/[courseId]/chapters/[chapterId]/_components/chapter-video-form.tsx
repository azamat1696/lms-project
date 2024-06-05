
"use client";
import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {useState} from "react";
import { Pencil, PlusCircle, Video} from "lucide-react";
import toast from "react-hot-toast";
import {Chapter, MuxData} from "@prisma/client";
import FileUpload from "@/components/file-upload";
import MuxPlayer from "@mux/mux-player-react";
interface ChapterVideoFormProps {
    initialData: Chapter & { muxData?: MuxData | null };
    courseId: string;
    chapterId: string;
}
const formSchema = z.object({
    videoUrl: z.string().min(3)
});

export default function ChapterVideoForm({initialData, courseId , chapterId}: ChapterVideoFormProps) {
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();

    const toggleEdit = () => setIsEditing((prev) => !prev);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
            toast.success("Chapter updated successfully");
            toggleEdit();
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong");
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Chapter video
                <Button variant="ghost" onClick={toggleEdit}>
                    {isEditing && <>Cancel</>}
                    {!isEditing && !initialData?.videoUrl && (
                        <>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add an Image
                        </>
                    )}
                    {!isEditing && initialData?.videoUrl && (
                        <>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Image
                        </>
                    )}
                </Button>
            </div>
            {!isEditing &&
                (!initialData?.videoUrl ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                        <Video className="h-10 w-10 text-slate-500" />
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2">
                          <MuxPlayer
                            playbackId={initialData?.muxData?.playbackId || ""}
                        />
                    </div>
                ))}
            {isEditing && (
                <div className="">
                    <FileUpload
                        endpoint="chapterVideo"
                        onChange={(url) => {
                            if (url) {
                                onSubmit({ videoUrl: url });
                            }
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        Upload a video for this chapter
                    </div>
                </div>
            )}
            {initialData.videoUrl && !isEditing && (
                <div className="text-xs text-muted-foreground mt-2">
                    Video can take a few minutes to process. Refresh the page if it doesnt show up.
                </div>
            )}
        </div>
    );
}
