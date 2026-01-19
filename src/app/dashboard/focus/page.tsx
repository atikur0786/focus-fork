
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RotateCcw, Play, Loader2, ArrowRight } from "lucide-react"
import { startSessionAction } from "@/app/actions"
import { FocusPlanDisplay } from "@/components/features/focus/focus-plan-display"
import { CoachPanel } from "@/components/features/focus/coach-panel"

export default function FocusSessionPage() {
    const [isActive, setIsActive] = useState(false)
    const [loading, setLoading] = useState(false)
    const [sessionData, setSessionData] = useState<any>(null)

    // Quick Timer state for demo
    const [timeLeft, setTimeLeft] = useState(25 * 60)

    // Check for issueUrl in searchParams
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const issueUrl = params.get("issueUrl")
        if (issueUrl && !isActive && !loading) {
            handleStart(issueUrl)
        }
    }, [])

    async function handleStart(issueUrl?: string) {
        setLoading(true)
        try {
            // Hardcoded inputs for MVP demo, can extend form later
            const formData = new FormData()
            formData.append("language", "typescript")
            formData.append("skillLevel", "beginner")
            if (issueUrl) {
                formData.append("issueUrl", issueUrl)
            }

            const result = await startSessionAction(formData)
            if (result.error) {
                alert(result.error)
            } else {
                setSessionData(result)
                setIsActive(true) // Auto start timer concept
            }
        } catch (e) {
            console.error(e)
            alert("Failed to start session")
        } finally {
            setLoading(false)
        }
    }

    if (!sessionData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold">Configure Focus Session</h2>
                    <p className="text-muted-foreground">Select your expertise and let AI handle the rest.</p>
                </div>

                <div className="glass-card p-8 rounded-2xl w-full max-w-md space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Language</label>
                            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" disabled>
                                <option>TypeScript</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Skill Level</label>
                            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" disabled>
                                <option>Beginner (Good First Issue)</option>
                            </select>
                        </div>
                    </div>

                    <Button className="w-full h-12 text-base" size="lg" onClick={() => handleStart()} disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Scouting Issues...
                            </>
                        ) : (
                            <>
                                Start Focused Work <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </div>
            </div>
        )
    }

    const { issue, plan } = sessionData

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight line-clamp-1">{issue.title}</h2>
                    <a href={issue.html_url} target="_blank" className="text-sm text-primary hover:underline flex items-center gap-1">
                        {issue.html_url.replace("https://github.com/", "")}
                        <ArrowRight className="w-3 h-3" />
                    </a>
                </div>
                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                        <span className="mr-2 h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        Flow State Active
                    </span>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
                {/* Main Timer & Controls */}
                <div className="md:col-span-2 lg:col-span-3 space-y-6">
                    <div className="glass-card rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-[300px] relative overflow-hidden transition-all duration-1000">
                        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />

                        {/* Timer Display */}
                        <div className="relative z-10 mb-8">
                            <div className="text-9xl font-mono font-bold tracking-tighter tabular-nums drop-shadow-sm text-foreground">
                                25:00
                            </div>
                            <p className="text-sm text-muted-foreground uppercase tracking-widest mt-4">Focus Block 1/4</p>
                        </div>

                        {/* Controls */}
                        <div className="flex gap-4 relative z-10">
                            <Button size="icon" variant="outline" className="rounded-full w-14 h-14 border-white/10 hover:bg-white/5">
                                <RotateCcw className="w-5 h-5" />
                            </Button>
                            <Button size="lg" className="rounded-full px-10 min-w-[160px] h-14 text-xl shadow-[0_0_20px_-5px_rgba(124,58,237,0.5)] bg-primary text-white hover:bg-primary/90">
                                {isActive ? "Pause" : "Resume"}
                            </Button>
                        </div>
                    </div>

                    <FocusPlanDisplay plan={plan} />
                </div>

                {/* Sidebar: AI Coach & Info */}
                <div className="space-y-6">
                    <CoachPanel plan={plan} />
                </div>
            </div>
        </div>
    )
}
