import {Menu} from "lucide-react";
import MobileSidebar from "@/app/(dashboard)/_components/mobile-sidebar";
import NavbarRoutes from "@/components/navbar-routes";

export default function Navbar() {
    return(
        <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
            <MobileSidebar/>
            <NavbarRoutes/>
        </div>
    )
}
