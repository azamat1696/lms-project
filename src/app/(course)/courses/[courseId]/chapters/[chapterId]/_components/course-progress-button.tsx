"use client";

import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

type Props = {
    courseId: string;
    chapterId: string;
    isCompleted?: boolean;
    nextChapterId?: string;
};

const CourseProgressButton: React.FC<Props> = ({
                                                   courseId,
                                                   chapterId,
                                                   isCompleted,
                                                   nextChapterId,
                                               }) => {
    const router = useRouter();
    const confetti = useConfettiStore();
    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);

            await axios.put(
                `/api/courses/${courseId}/chapters/${chapterId}/progress`,
                {
                    isCompleted: !isCompleted,
                }
            );

            if (!isCompleted && !nextChapterId) {
                confetti.onOpen();
            }

            if (!isCompleted && nextChapterId) {
                router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
            }

            toast.success("Progress updated successfully");
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const Icon = isCompleted ? XCircle : CheckCircle;

    return (
        <Button
            type="button"
            variant={isCompleted ? "outline" : "secondary"}
            onClick={onClick}
            disabled={isLoading}
            className="w-full md:w-auto">
            {isCompleted ? "Not completed" : "Mark as completed"}
            <Icon className="ml-2 h-4 w-4" />
        </Button>
    );
};

export default CourseProgressButton;
