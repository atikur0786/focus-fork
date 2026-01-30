"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardIssueBrowser } from "@/components/features/dashboard/dashboard-issue-browser"
import { AgentScout } from "@/components/features/dashboard/agent-scout"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Button } from "@/components/ui/button"
import { GitHubIssue } from "@/lib/github/scout"
import { extractRepoInfoFromUrl } from "@/app/actions"
import { ArrowRight, Code2 } from "lucide-react"

export default function DashboardPage() {
    const [selectedIssue, setSelectedIssue] = useState<GitHubIssue | null>(null)
    const router = useRouter()

    const handleStartWork = async () => {
        if (!selectedIssue) return
        
        // Extract repository info from issue URL
        const repoInfo = await extractRepoInfoFromUrl(selectedIssue.html_url)
        if (repoInfo) {
            // Navigate to workspace with the issue info
            router.push(`/dashboard/workspaces/${selectedIssue.id}?repo=${repoInfo.owner}/${repoInfo.repo}&issue=${encodeURIComponent(selectedIssue.html_url)}`)
        }
    }

    return (
        <div className="h-[calc(100vh-6rem)] animate-in fade-in duration-500">
            <ResizablePanelGroup orientation="horizontal" className="h-full rounded-lg border">
                <ResizablePanel defaultSize={60} minSize={30}>
                    <div className="h-full p-4 overflow-hidden">
                        <DashboardIssueBrowser onIssueSelect={setSelectedIssue} />
                    </div>
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={40} minSize={30}>
                    <div className="h-full p-4 overflow-hidden bg-muted/10">
                        <div className="h-full flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold">Focus Coach</h2>
                                {selectedIssue && (
                                    <Button onClick={handleStartWork} className="text-xs" size="sm">
                                        <Code2 className="w-4 h-4 mr-2" />
                                        Start Working
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                )}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <AgentScout selectedIssue={selectedIssue} />
                            </div>
                        </div>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}
