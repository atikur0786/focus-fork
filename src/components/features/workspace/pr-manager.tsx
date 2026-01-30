"use client"

import { useState, useEffect } from "react"
import { getPullRequestsAction } from "@/app/actions"
import { GitHubPullRequest } from "@/lib/github/service"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ExternalLink, GitPullRequest, GitPullRequestClosed, GitPullRequestDraft, CheckCircle, Clock, AlertCircle } from "lucide-react"

interface PullRequestManagerProps {
    owner: string
    repo: string
}

export function PullRequestManager({ owner, repo }: PullRequestManagerProps) {
    const [pullRequests, setPullRequests] = useState<GitHubPullRequest[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadPullRequests()
    }, [owner, repo])

    const loadPullRequests = async () => {
        try {
            const prs = await getPullRequestsAction(owner, repo)
            setPullRequests(prs)
        } catch (error) {
            console.error("Error loading pull requests:", error)
        } finally {
            setLoading(false)
        }
    }

    const getPRIcon = (state: string) => {
        switch (state) {
            case "open":
                return <GitPullRequest className="w-4 h-4 text-green-500" />
            case "closed":
                return <GitPullRequestClosed className="w-4 h-4 text-red-500" />
            case "merged":
                return <GitPullRequestDraft className="w-4 h-4 text-purple-500" />
            default:
                return <GitPullRequest className="w-4 h-4" />
        }
    }

    const getPRBadgeVariant = (state: string) => {
        switch (state) {
            case "open":
                return "default"
            case "closed":
                return "destructive"
            case "merged":
                return "secondary"
            default:
                return "outline"
        }
    }

    const getStatusIcon = (pr: GitHubPullRequest) => {
        if (pr.state === "merged") {
            return <CheckCircle className="w-3 h-3 text-green-500" />
        } else if (pr.state === "closed") {
            return <AlertCircle className="w-3 h-3 text-red-500" />
        } else {
            return <Clock className="w-3 h-3 text-yellow-500" />
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-32">
                <div className="text-sm text-muted-foreground">Loading pull requests...</div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Pull Requests</h3>
                <Button variant="outline" size="sm" onClick={loadPullRequests}>
                    Refresh
                </Button>
            </div>

            <ScrollArea className="h-64">
                <div className="space-y-2">
                    {pullRequests.length === 0 ? (
                        <div className="text-center py-8 text-sm text-muted-foreground">
                            No pull requests found
                        </div>
                    ) : (
                        pullRequests.map((pr) => (
                            <div
                                key={pr.id}
                                className="p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            {getPRIcon(pr.state)}
                                            <Badge variant={getPRBadgeVariant(pr.state)} className="text-xs">
                                                {pr.state}
                                            </Badge>
                                            {getStatusIcon(pr)}
                                            <span className="text-xs text-muted-foreground">#{pr.number}</span>
                                        </div>
                                        <h4 className="text-sm font-medium truncate">{pr.title}</h4>
                                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                            {pr.body || "No description provided"}
                                        </p>
                                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                            <span>by {pr.user.login}</span>
                                            <span>•</span>
                                            <span>{new Date(pr.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => window.open(pr.html_url, "_blank")}
                                        className="flex-shrink-0"
                                    >
                                        <ExternalLink className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </ScrollArea>
        </div>
    )
}