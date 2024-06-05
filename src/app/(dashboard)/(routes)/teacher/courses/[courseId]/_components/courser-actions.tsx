"use client";

import {Button} from "@/components/ui/button";
import {Trash} from "lucide-react";
import {ConfirmModal} from "@/components/modal/confirm-modal";
import {useState} from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import {useConfettiStore} from "@/hooks/use-confetti-store";
interface CourseActionsProps {
    disabled: boolean;
    courseId: string;
    isPublished: boolean;
}

export function CourseActions({isPublished,disabled,courseId}:CourseActionsProps) {
     const [isLoading,setIsLoading] = useState(false)
     const router = useRouter()
     const confetti = useConfettiStore()
     const onDelete = async () => {
         try {
             setIsLoading(true)
             await axios.delete(`/api/courses/${courseId}`)
             toast.success("Course deleted successfully")
             router.refresh()
             router.push(`/teacher/courses`)
         } catch (error) {
             toast.error("Something went wrong")
         } finally {
             setIsLoading(false)
         }
     }
     const onPublish = async () => {
            try {
                setIsLoading(true)
                if (isPublished) {
                    await axios.patch(`/api/courses/${courseId}/unpublish`).catch((error) => {
                        console.log(error)
                    })
                    toast.success("Course unpublished successfully")
                } else {
                     await axios.patch(`/api/courses/${courseId}/publish`)
                     toast.success("Course published successfully")
                        confetti.onOpen()
                }
                router.refresh()
            } catch (error) {
                toast.error(`Something went wrong`)
            } finally {
                setIsLoading(false)
            }
     }
     return(
         <div className="flex items-center gap-x-2">
            <Button
                variant="outline"
                disabled={disabled || isLoading}
                onClick={onPublish}
                size={"sm"}
            >
                {isPublished ? "Unpublish" : "Publish"}
            </Button>
           <ConfirmModal onConfirm={onDelete}>
                  <div className="border p-1.5 rounded-md bg-gray-800" >
                      <Trash className="h-5 w-5 text-white"/>
                  </div>
           </ConfirmModal>
         </div>
     )
}
