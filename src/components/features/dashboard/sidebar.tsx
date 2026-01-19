"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Target,
    History,
    ChevronLeft,
    ChevronRight,
    User,
    Settings,
    LogOut,
    Menu,
    Search,
    Bot,
    Code2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ManageAccountModal } from "./manage-account-modal"
import { signOut } from "next-auth/react" // Using client-side logout for sidebar

interface SidebarProps {
    user: any
}

export function Sidebar({ user }: SidebarProps) {
    const pathname = usePathname()
    const [collapsed, setCollapsed] = useState(false)
    const [manageOpen, setManageOpen] = useState(false)

    // Persist collapsed state
    useEffect(() => {
        const saved = localStorage.getItem("sidebar-collapsed")
        if (saved) setCollapsed(JSON.parse(saved))
    }, [])

    const toggleCollapse = () => {
        const newState = !collapsed
        setCollapsed(newState)
        localStorage.setItem("sidebar-collapsed", JSON.stringify(newState))
    }

    const navItems = [
        { href: "/dashboard", label: "Explore", icon: Search },
        { href: "/dashboard/agent", label: "AI Assistant", icon: Bot },
        { href: "/dashboard/workspaces", label: "My Workspaces", icon: Code2 },
        { href: "/dashboard/focus", label: "Focus Session", icon: Target }, // Keeping for backward compat logic for now
        { href: "/dashboard/history", label: "History", icon: History, disabled: true },
    ]

    return (
        <>
            <aside
                className={cn(
                    "border-r border-border bg-card/30 flex-col hidden md:flex transition-all duration-300 relative",
                    collapsed ? "w-16" : "w-64"
                )}
            >
                <div className={cn("p-6 flex items-center h-20", collapsed ? "justify-center px-2" : "justify-between")}>
                    {!collapsed && (
                        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                            <span className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/50 flex items-center justify-center text-primary">F</span>
                            FocusFork
                        </Link>
                    )}
                    {collapsed && (
                        <span className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/50 flex items-center justify-center text-primary font-bold">F</span>
                    )}
                </div>

                <nav className="flex-1 px-3 space-y-2 mt-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.disabled ? "#" : item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                pathname === item.href
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                item.disabled && "opacity-50 cursor-not-allowed",
                                collapsed && "justify-center px-0"
                            )}
                            title={collapsed ? item.label : undefined}
                        >
                            <item.icon className="w-4 h-4" />
                            {!collapsed && <span>{item.label}</span>}
                        </Link>
                    ))}
                </nav>

                {/* Collapse Toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -right-3 top-20 h-6 w-6 rounded-full border border-border bg-background shadow-sm hover:bg-accent z-10"
                    onClick={toggleCollapse}
                >
                    {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
                </Button>

                <div className="p-3 border-t border-border mt-auto">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className={cn("w-full justify-start px-2", collapsed && "justify-center")}>
                                <Avatar className="h-8 w-8 mr-2">
                                    <AvatarImage src={user.image} />
                                    <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                {!collapsed && (
                                    <div className="flex flex-col items-start truncate text-left">
                                        <span className="text-sm font-medium truncate w-32">{user.name}</span>
                                        <span className="text-xs text-muted-foreground truncate w-32">{user.email}</span>
                                    </div>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 mb-2">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setManageOpen(true)}>
                                <User className="mr-2 h-4 w-4" />
                                Manage Account
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled>
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-destructive focus:text-destructive cursor-pointer"
                                onClick={() => signOut({ callbackUrl: "/" })}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Sign Out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </aside>

            <ManageAccountModal
                user={user}
                open={manageOpen}
                onOpenChange={setManageOpen}
            />
        </>
    )
}
