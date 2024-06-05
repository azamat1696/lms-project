"use client";
import {SearchIcon} from "lucide-react";
import {Input} from "@/components/ui/input";
import {useEffect, useState} from "react";
import qs from "query-string";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {useDebounce} from "@/hooks/use-debounce";
export function SearchInput() {
    const [value, setValue] = useState("");
    const debouncedValue = useDebounce(value);
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const currentCategoryId = searchParams.get("categoryId");
    useEffect(() => {
        const url = qs.stringifyUrl(
            {
                url: pathname,
                query: {
                    categoryId: currentCategoryId,
                    title: debouncedValue,
                },
            },
            { skipNull: true, skipEmptyString: true }
        );
        router.push(url);
    }, [currentCategoryId, debouncedValue, pathname, router]);
    return (
        <div className="relative">
            <SearchIcon className="h-4 w-4 absolute top-3 left-3 text-slate-600"/>
            <Input
                onChange={(e) => setValue(e.target.value)}
                value={value}
                placeholder="Search for a course"
                className="w-full md:w-[300px] rounded-full pl-9 bg-slate-100 focus-visible:ring-slate-200"
            />
        </div>
    );
}
