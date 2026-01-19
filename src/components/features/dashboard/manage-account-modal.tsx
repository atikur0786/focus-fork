"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { BarChart3, CreditCard, Settings, User } from "lucide-react"

interface ManageAccountModalProps {
    user: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ManageAccountModal({ user, open, onOpenChange }: ManageAccountModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] bg-card border-border text-foreground">
                <DialogHeader>
                    <DialogTitle>Manage Account</DialogTitle>
                    <DialogDescription>
                        View your profile and usage statistics.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4 text-foreground">
                    {/* User Profile Section */}
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 border border-border">
                            <AvatarImage src={user?.image} />
                            <AvatarFallback className="text-lg">{user?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="text-lg font-medium">{user?.name}</h3>
                            <p className="text-sm text-muted-foreground">{user?.email}</p>
                            <p className="text-xs text-muted-foreground mt-1">Free Plan</p>
                        </div>
                        <Button variant="outline" className="ml-auto" disabled>
                            Edit Profile
                        </Button>
                    </div>

                    {/* Usage Stats (Placeholder) */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg border border-border bg-muted/20">
                            <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                                <BarChart3 className="w-4 h-4" />
                                <span className="text-sm font-medium">Focus Sessions</span>
                            </div>
                            <div className="text-2xl font-bold">12</div>
                            <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
                        </div>

                        <div className="p-4 rounded-lg border border-border bg-muted/20">
                            <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                                <CreditCard className="w-4 h-4" />
                                <span className="text-sm font-medium">Contribs. Initiated</span>
                            </div>
                            <div className="text-2xl font-bold">8</div>
                            <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
                        </div>
                    </div>

                    {/* Account Actions */}
                    <div className="space-y-2">
                        <Label>API Keys</Label>
                        <div className="flex gap-2">
                            <Input readOnly value="sk_test_..." className="font-mono text-muted-foreground" />
                            <Button variant="outline" size="icon">
                                <span className="sr-only">Copy</span>
                                <Settings className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
