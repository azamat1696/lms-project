"use client";
import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {useState} from "react";
import { Loader2, PlusCircle, X , File} from "lucide-react";
import toast from "react-hot-toast";
import {Attachment, Course} from "@prisma/client";
import FileUpload from "@/components/file-upload";
interface AttachmentFormProps {
    initialData: Course & { attachments: Attachment[] };
    courseId: string;
}
const formSchema = z.object({
    url: z.string().min(1),
});

export default function AttachmentForm({initialData, courseId}: AttachmentFormProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const router = useRouter();

    const toggleEdit = () => setIsEditing((prev) => !prev);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/attachments`, values);
            toast.success("Course updated successfully");
            toggleEdit();
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong");
        }
    }
    const onDelete = async (id: string) => {
        try {
            setDeletingId(id);
            await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
            toast.success("Attachment deleted successfully");
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course attachment
                <Button variant="ghost" onClick={toggleEdit}>
                    {isEditing && <>Cancel</>}
                    {!isEditing && (
                        <>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add a file
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
              <>
                  {initialData.attachments.length === 0 && (
                          <p className="text-sm mt-2 text-slate-500 italic">
                                No attachments added yet.
                          </p>
                      )}
                  {
                      initialData.attachments.length > 0 && (
                          <div className="space-y-2">
                              {initialData.attachments.map((attachment) => (
                                      <div
                                          className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                                          key={attachment.id}>
                                          <File className="h-4 w-4 mr-2 flex-shrink-0"/>
                                          <p className="text-xs line-clamp-1">{attachment.name}</p>
                                          {deletingId === attachment.id && (
                                              <div>
                                                  <Loader2 className="h-4 w-4 animate-spin"/>
                                              </div>
                                          )}
                                          {deletingId !== attachment.id && (
                                              <button
                                                  className="ml-auto hover:opacity-75 transition"
                                                  onClick={() => onDelete(attachment.id)}>
                                                  <X className="h-4 w-4"/>
                                              </button>
                                          )}
                                      </div>
                                  ))}
                          </div>
                      )
                  }

              </>
            )}
            {isEditing && (
                <div className="">
                    <FileUpload
                        endpoint="courseAttachment"
                        onChange={(url) => {
                            if (url) {
                                onSubmit({url: url});
                            }
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        Add anything your student might need to complete the course.
                    </div>
                </div>
            )}
        </div>
    );
}
