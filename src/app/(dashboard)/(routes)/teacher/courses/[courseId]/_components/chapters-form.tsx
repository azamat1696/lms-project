"use client";
import * as z from "zod";
import axios from "axios";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {PlusCircle} from "lucide-react";
import toast from "react-hot-toast";
import {Chapter, Course} from "@prisma/client";
import React from "react";
import ChaptersList from "./chapters-list";
import {Button} from "../../../../../../../components/ui/button";
import {Form, FormControl, FormField, FormItem, FormMessage} from "../../../../../../../components/ui/form";
import {Input} from "../../../../../../../components/ui/input";
import {cn} from "../../../../../../../lib/utils";
interface ChapterFormProps {
    initialData: Course & { chapters: Chapter[] };
    courseId: string;
}
const formSchema = z.object({
    title: z.string().min(1)
});

export default function ChaptersForm({initialData, courseId}: ChapterFormProps) {
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const router = useRouter();

    const toggleCreating = () => setIsCreating((prev) => !prev);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: ""
        }
    });
    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/chapters`, values);
            toast.success("Chapter created successfully");
            toggleCreating();
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong");
        }
    }
    const onReorder = async (updateData: { id: string; position: number }[]) => {

        try {
            setIsUpdating(true);
            console.log(updateData);
            await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
                list: updateData,
            });

            toast.success("Chapters reordered successfully");
            router.refresh();
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        } finally {
            setIsUpdating(false);
        }
    };

    const onEdit = (id: string) => {
        router.push(`/teacher/courses/${courseId}/chapters/${id}`);
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course chapter
                <Button variant="ghost" onClick={toggleCreating}>
                    {isCreating ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <PlusCircle className="mr-2 h-4 w-4"/>
                            Add a chapter
                        </>
                    )}
                </Button>
            </div>
            {isCreating && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="mt-4 space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g 'Introduction to the course''"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                            <Button disabled={isSubmitting || !isValid} type="submit">
                                Create
                            </Button>
                    </form>
                </Form>
            )}
            {!isCreating && (
                <div>
                    <p className={cn("text-sm mt-2",
                        !initialData.chapters.length && "text-slate-500 italic"
                    )}>
                        {!initialData.chapters.length && "No chapters"}
                    </p>
                    <ChaptersList
                        onEdit={onEdit}
                        onReorder={onReorder}
                        items={initialData.chapters || [] }
                    />
                </div>
            )}
            {!isCreating && (
                <p className="text-xs text-muted-foreground mt-4">
                    Drag and drop to reorder chapters
                </p>
            )}
        </div>
    );
}
