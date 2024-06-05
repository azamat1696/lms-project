"use client";

import {BarChart, Compass, Layout, List} from "lucide-react";
import SidebarItem from "@/app/(dashboard)/_components/sidebar-item";
import { usePathname } from "next/navigation";
const guestRoutes = [
    {
        icon: Layout,
        label: "Dashboard",
        href: "/",
    },
    {
        icon: Compass,
        label: "Browse",
        href: "/search",
    }
];
const teacherRoutes = [
    {
        icon: List,
        label: "Courses",
        href: "/teacher/courses",
    },
    {
        icon: BarChart,
        label: "Analytics",
        href: "/teacher/analytics",
    }
];
export default function SidebarRoutes() {
    const pathname = usePathname();
    const isTeacherPage = pathname?.includes("/teacher");
     const routes = isTeacherPage ? teacherRoutes : guestRoutes;
     return(
         <div className="flex flex-col w-full">
             {
                 routes.map((route, index) => (
                     <SidebarItem
                         key={index}
                         icon={route.icon}
                         label={route.label}
                         href={route.href}
                     />
                     ))
             }
         </div>
     )
}
