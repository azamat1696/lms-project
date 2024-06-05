import Sidebar from "@/app/(dashboard)/_components/sidebar";
import Navbar from "@/app/(dashboard)/_components/Navbar";
export default function DashboardLayout({
                                           children,
                                         }: {
    children: React.ReactNode
}) {
    return (
        <div className="h-full">
            <div className="h-[80px] md:pl-56 fixed inset-y-0 w-full z-50">
                <Navbar/>
            </div>
            <div className="hidden md:flex w-56 flex-col fixed inset-y-0 z-50">
                <Sidebar/>
            </div>
            <main className="md:pl-56 h-full pt-[80px]">{children}</main>
        </div>
    )
}
