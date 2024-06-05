"use client";

import Image from "next/image";
import Link from "next/link";
import {IconBadge} from "@/components/icon-badge";
import {BookOpen} from "lucide-react";
import {formatPrice} from "@/lib/format";
import CourseProgress from "@/components/course-progress";

type Props = {
    id: string;
    title: string;
    imageUrl: string;
    chaptersLength: number;
    price: number;
    category: string;
    progress: number | null;
}

export function CourseCard({id,title,category, chaptersLength,imageUrl,progress,price}:Props){
    return(
        <Link href={`/courses/${id}`}>
            <div className="group hover:shadow-sm transition rounded-lg overflow-hidden cursor-pointer border p-3 h-full">
                <div className="relative w-full aspect-video rounded-md overflow-hidden ">
                    <Image fill className="object-cover" src={imageUrl} alt={title} />
                </div>
                <div className="flex flex-col pt-2">
                    <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
                        {title}
                    </div>
                    <p className="text-xs text-muted-foreground">{category}</p>
                    <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
                        <div className="flex items-center gap-x-1 text-slate-500">
                            <IconBadge icon={BookOpen} size="sm" />
                            <span>
                {chaptersLength} {chaptersLength === 1 ? "Chapter" : "Chapters"}
              </span>
                        </div>
                    </div>
                    {progress !== null ? (
                        <CourseProgress
                            variant={progress === 100 ? "success" : "default"}
                            size="sm"
                            value={progress}
                        />
                    ) : (
                        <p className="text-md md:text-sm font-medium text-salte-600">
                            {formatPrice(price)}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    )
}
