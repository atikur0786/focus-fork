"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Loader2 } from "lucide-react"
import { searchPublicIssuesAction } from "@/app/actions"
import { GitHubIssue } from "@/lib/github/scout"

const POPULAR_LANGUAGES = ["TypeScript", "JavaScript", "Python", "Rust", "Go"]

interface DashboardIssueBrowserProps {
    onIssueSelect?: (issue: GitHubIssue) => void;
}

export function DashboardIssueBrowser({ onIssueSelect }: DashboardIssueBrowserProps) {
    const [query, setQuery] = useState("")
    const [issues, setIssues] = useState<GitHubIssue[]>([])
    const [loading, setLoading] = useState(false)
    const [searched, setSearched] = useState(false)
    const [selectedIssueId, setSelectedIssueId] = useState<number | null>(null)

    const handleSearch = async (term: string) => {
        if (!term.trim()) return
        setLoading(true)
        setSearched(true)
        try {
            const results = await searchPublicIssuesAction(term)
            setIssues(results as GitHubIssue[])
        } catch (error) {
            console.error("Search failed", error)
        } finally {
            setLoading(false)
        }
    }

    const handleIssueClick = (issue: GitHubIssue) => {
        setSelectedIssueId(issue.number)
        if (onIssueSelect) {
            onIssueSelect(issue)
        }
    }

    return (
        <div className="w-full space-y-8 animate-in fade-in duration-500">
            <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tight">Explore Issues</h2>
                <p className="text-muted-foreground text-lg">
                    Start contributing by choosing an issue directly here, or let our AI Agent guide you.
                </p>
            </div>

            <div className="flex flex-col gap-4">
                {/* Search Bar */}
                <div className="relative max-w-2xl">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        className="pl-10 h-12 bg-card border-border rounded-xl focus:ring-primary/50 text-base"
                        placeholder="Search issues (e.g., 'react bug', 'documentation')"
                        value={query}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && handleSearch(query)}
                    />
                    <Button
                        size="sm"
                        className="absolute right-1.5 top-1.5 bottom-1.5 rounded-lg"
                        onClick={() => handleSearch(query)}
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
                    </Button>
                </div>

                {/* Quick Filters */}
                <div className="flex flex-wrap gap-2">
                    {POPULAR_LANGUAGES.map((lang) => (
                        <Badge
                            key={lang}
                            variant="outline"
                            className="cursor-pointer hover:bg-muted transition-colors px-3 py-1 flex items-center gap-1.5"
                            onClick={() => {
                                setQuery(`language:${lang} `)
                                handleSearch(`language:${lang}`)
                            }}
                        >
                            {lang}
                        </Badge>
                    ))}
                </div>
            </div>

            {/* Results Grid */}
            <div className="grid gap-4 mt-8">
                {loading ? (
                    <div className="text-center py-12 text-muted-foreground animate-pulse">Scanning GitHub...</div>
                ) : issues.length > 0 ? (
                    issues.map((issue) => (
                        <div
                            key={issue.id}
                            className={`group flex items-start justify-between p-4 rounded-xl border transition-all cursor-pointer ${selectedIssueId === issue.number
                                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                                    : "border-border bg-card hover:border-primary/30 hover:bg-accent/5"
                                }`}
                            onClick={() => handleIssueClick(issue)}
                        >
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span className="font-medium text-foreground">{issue.repository_url.split("/").slice(-2).join("/")}</span>
                                    <span>•</span>
                                    <span>#{issue.number}</span>
                                    <span>•</span>
                                    <span>{new Date(issue.created_at).toLocaleDateString()}</span>
                                </div>
                                <h4 className="font-medium group-hover:text-primary transition-colors line-clamp-1 text-lg">{issue.title}</h4>
                                <div className="flex gap-2 mt-2">
                                    {issue.labels.slice(0, 3).map((label) => {
                                        const labelName = typeof label === 'string' ? label : label.name;
                                        return (
                                            <span key={typeof label === 'string' ? label : label.id} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground">
                                                {labelName}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ))
                ) : searched ? (
                    <div className="text-center py-12 text-muted-foreground">No issues found. Try a different query.</div>
                ) : (
                    <div className="text-center py-12 text-muted-foreground">
                        Search for an issue to get started in your open source journey.
                    </div>
                )}
            </div>
        </div>
    )
}
