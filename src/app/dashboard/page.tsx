
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Play } from "lucide-react"

export default function DashboardPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">Welcome back to your flow state.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Quick Start Card */}
                <div className="col-span-2 glass-card rounded-xl p-8 relative overflow-hidden group">
                    <div className="relative z-10">
                        <h3 className="text-2xl font-semibold mb-2">Start a Focus Session</h3>
                        <p className="text-muted-foreground mb-8 max-w-md text-lg">
                            Ready to contribute? Let our AI find you the perfect issue and guide you through the process.
                        </p>
                        <Link href="/dashboard/focus">
                            <Button size="lg" className="gap-2 rounded-full px-8 h-12 text-base shadow-[0_0_15px_-3px_rgba(124,58,237,0.4)] transition-shadow hover:shadow-[0_0_25px_-5px_rgba(124,58,237,0.6)]">
                                <Play className="w-5 h-5" />
                                Initialize Session
                            </Button>
                        </Link>
                    </div>
                    <div className="absolute right-0 top-0 w-80 h-80 bg-primary/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/15 transition-colors duration-500" />
                </div>

                {/* Stats Card */}
                <div className="glass-card rounded-xl p-6 flex flex-col justify-center items-center text-center">
                    <div className="text-5xl font-bold text-white mb-2">0</div>
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Contribution Streak</span>
                </div>
            </div>
        </div>
    )
}
