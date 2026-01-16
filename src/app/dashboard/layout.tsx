
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { UserNav } from "@/components/features/auth/user-nav"
import Link from "next/link"
import { LayoutDashboard, Target, History } from "lucide-react"

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
            <aside className="w-64 border-r border-border bg-card/30 hidden md:flex flex-col">
                <div className="p-6">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                        <span className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/50 flex items-center justify-center text-primary">F</span>
                        FocusFork
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md bg-primary/10 text-primary">
                        <LayoutDashboard className="w-4 h-4" />
                        Overview
                    </Link>
                    <Link href="/dashboard/focus" className="flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors">
                        <Target className="w-4 h-4" />
                        Focus Session
                    </Link>
                    {/* Placeholder for future History feature */}
                    <div className="flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md text-muted-foreground opacity-50 cursor-not-allowed">
                        <History className="w-4 h-4" />
                        History (Soon)
                    </div>
                </nav>

                <div className="p-4 border-t border-border">
                    <div className="flex items-center gap-3 px-4 py-2">
                        <UserNav user={session.user} />
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-medium truncate">{session.user?.name}</span>
                            <span className="text-xs text-muted-foreground truncate">{session.user?.email}</span>
                        </div>
                    </div>
                </div>
            </aside>

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
