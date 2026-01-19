
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { UserNav } from "@/components/features/auth/user-nav"
import Link from "next/link"
import { LayoutDashboard, Target, History } from "lucide-react"
import { Sidebar } from "@/components/features/dashboard/sidebar"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    if (!session) {
        redirect("/")
    }

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            {/* Sidebar */}
            <Sidebar user={session.user} />

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                <header className="h-14 border-b border-border flex items-center justify-between px-6 md:hidden">
                    <span className="font-bold">FocusFork</span>
                    <UserNav user={session.user} />
                </header>
                <div className="flex-1 p-6 md:p-10 overflow-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
