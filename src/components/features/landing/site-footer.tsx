import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export function SiteFooter() {
    return (
        <footer className="border-t border-border bg-muted/50 pt-16 pb-8">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-xl font-bold tracking-tight text-foreground">FocusFork</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-[240px]">
                            The operating system for open source contributors. Helping you find flow in a distracted world.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold text-foreground mb-4">Platform</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><Link href="#features" className="hover:text-primary transition-colors">Features</Link></li>
                            <li><Link href="#public-browser" className="hover:text-primary transition-colors">Issue Browser</Link></li>
                            <li><Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-foreground mb-4">Company</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-primary transition-colors">About</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-foreground mb-4">Legal</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-primary transition-colors">Privacy</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Terms</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-muted-foreground">© 2026 FocusFork Inc. All rights reserved.</p>
                    <div className="flex gap-4 items-center">
                        <span className="text-xs text-muted-foreground">Switch Theme</span>
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </footer>
    )
}
