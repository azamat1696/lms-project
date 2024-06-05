"use client";
import {LucideIcon} from "lucide-react";
import Link from "next/link";
import { usePathname,useRouter } from "next/navigation";
import {Button} from "@/components/ui/button";
interface SideBarItemProps {
    icon: LucideIcon;
    label: string;
    href: string;
}

export default function SidebarItem({icon:Icon, label,href}: SideBarItemProps) {
     const pathname = usePathname();
        const router = useRouter();
        const isActive = (href === "/" && pathname === "/") || pathname === href || pathname?.startsWith(`${href}/`);
        const onClick = () => {
            router.push(href);
        }

    return (
        <Button
            className={`flex items-center gap-x-2 bg-white text-slate-500 text-sm font-medium pl-6 transition-all hover:text-slate-600  hover:bg-slate-300/20
            ${isActive && "text-sky-700 bg-sky-200/20 hover:bg-sky-200/20 hover:text-sky-700"}
            `}
            onClick={onClick}
            type="button"
        >
          <div className="flex items-center gap-x-2 py-4">
                <Icon
                    size={22}
                    className={`text-slate-500  ${isActive && "text-sky-700 "}`}
                />
                <span>{label}</span>
          </div>
            <div className={`ml-auto opacity-0 border-2 border-sky-700 h-full transition-all ${isActive && "opacity-100"}`}>
            </div>
        </Button>
    );
}
