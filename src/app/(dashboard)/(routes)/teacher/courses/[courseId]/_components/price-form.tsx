"use client";
import * as z from "zod";
import axios from "axios";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {Pencil} from "lucide-react";
import toast from "react-hot-toast";
import {cn} from "@/lib/utils";
import {Course} from "@prisma/client";
import {Input} from "@/components/ui/input";
import {formatPrice} from "@/lib/format";
interface priceFormProps {
    initialData: Course
    courseId: string;
}
const formSchema = z.object({
    price: z.coerce.number()
});

export default function PriceForm({initialData, courseId}: priceFormProps) {
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();

    const toggleEdit = () => setIsEditing((prev) => !prev);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            price: initialData?.price || undefined
        }
    });
    const { isSubmitting, isValid } = form.formState;


    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            toast.success("Course updated successfully");
            toggleEdit();
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong");
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course price
                <Button variant="ghost" onClick={toggleEdit}>
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="mr-2 h-4 w-4"/>
                            Edit price
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p className={cn("text-sm mt-2", !initialData.price && "text-slate-500 italic")}>
                    {initialData.price ? formatPrice(initialData.price) : "No price"}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="mt-4 space-y-4">
                        <FormField
                            control={form.control}
                            name="price"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step={0.01}
                                            disabled={isSubmitting}
                                            placeholder="Set a price for your course"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button disabled={isSubmitting || !isValid} type="submit">
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    );
}
