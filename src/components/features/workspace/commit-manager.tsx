"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { GitCommit, GitBranch, Clock, User } from "lucide-react"

interface CommitInfo {
    sha: string
    message: string
    author: {
        name: string
        email: string
        date: string
    }
    url: string
}

interface CommitManagerProps {
    owner: string
    repo: string
    branch?: string
}

export function CommitManager({ owner, repo, branch = "main" }: CommitManagerProps) {
    const [commits, setCommits] = useState<CommitInfo[]>([])
    const [loading, setLoading] = useState(false)

    const loadCommits = async () => {
        setLoading(true)
        try {
            // This would be implemented with the getCommits action
            // For now, showing mock data
            const mockCommits: CommitInfo[] = [
                {
                    sha: "abc123",
                    message: "Fix: Update component logic",
                    author: {
                        name: "John Doe",
                        email: "john@example.com",
                        date: new Date().toISOString()
                    },
                    url: `https://github.com/${owner}/${repo}/commit/abc123`
                }
            ]
            setCommits(mockCommits)
        } catch (error) {
            console.error("Error loading commits:", error)
        } finally {
            setLoading(false)
        }
    }

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
        
        if (diffInMinutes < 60) {
            return `${diffInMinutes}m ago`
        } else if (diffInMinutes < 1440) {
            return `${Math.floor(diffInMinutes / 60)}h ago`
        } else {
            return `${Math.floor(diffInMinutes / 1440)}d ago`
        }
    }

    const getShortSha = (sha: string) => {
        return sha.substring(0, 7)
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <GitCommit className="w-4 h-4" />
                    <h3 className="text-sm font-semibold">Commits</h3>
                    <Badge variant="outline" className="text-xs">
                        {branch}
                    </Badge>
                </div>
                <Button variant="outline" size="sm" onClick={loadCommits}>
                    Refresh
                </Button>
            </div>

            <ScrollArea className="h-48">
                <div className="space-y-2">
                    {loading ? (
                        <div className="text-center py-4 text-sm text-muted-foreground">
                            Loading commits...
                        </div>
                    ) : commits.length === 0 ? (
                        <div className="text-center py-4 text-sm text-muted-foreground">
                            No commits yet
                        </div>
                    ) : (
                        commits.map((commit) => (
                            <div
                                key={commit.sha}
                                className="p-2 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge variant="secondary" className="text-xs font-mono">
                                                {getShortSha(commit.sha)}
                                            </Badge>
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <User className="w-3 h-3" />
                                                {commit.author.name}
                                            </div>
                                        </div>
                                        <p className="text-sm font-medium truncate">{commit.message}</p>
                                        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                                            <Clock className="w-3 h-3" />
                                            {formatTimeAgo(commit.author.date)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </ScrollArea>
        </div>
    )
}