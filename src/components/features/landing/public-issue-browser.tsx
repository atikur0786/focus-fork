"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, ExternalLink, Loader2 } from "lucide-react"
import { searchPublicIssuesAction } from "@/app/actions"
import { GitHubIssue, GitHubLabel } from "@/lib/github/scout"

const POPULAR_LANGUAGES = ["TypeScript", "JavaScript", "Python", "Rust", "Go"]

export function PublicIssueBrowser() {
    const [query, setQuery] = useState("")
    const [issues, setIssues] = useState<GitHubIssue[]>([])
    const [loading, setLoading] = useState(false)
    const [searched, setSearched] = useState(false)

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

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8">
            <div className="space-y-4 text-center">
                <h3 className="text-2xl font-bold tracking-tight">Explore Open Issues</h3>
                <p className="text-muted-foreground">Search across thousands of repositories. No login required.</p>
            </div>

            <div className="flex flex-col gap-4">
                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        className="pl-10 h-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary/50 text-base"
                        placeholder="Search by keyword (e.g., 'react bug', 'documentation')"
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
                <div className="flex flex-wrap gap-2 justify-center">
                    {POPULAR_LANGUAGES.map((lang) => (
                        <Badge
                            key={lang}
                            variant="outline"
                            className="cursor-pointer hover:bg-white/10 transition-colors px-3 py-1 flex items-center gap-1.5"
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
                        <div key={issue.id} className="group flex items-start justify-between p-4 rounded-xl border border-white/10 bg-white/5 hover:border-primary/30 hover:bg-white/[0.07] transition-all">
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span className="font-medium text-foreground">{issue.repository_url.split("/").slice(-2).join("/")}</span>
                                    <span>•</span>
                                    <span>#{issue.number}</span>
                                    <span>•</span>
                                    <span>{new Date(issue.created_at).toLocaleDateString()}</span>
                                </div>
                                <h4 className="font-medium group-hover:text-primary transition-colors line-clamp-1">{issue.title}</h4>
                                <div className="flex gap-2 mt-2">
                                    {issue.labels.slice(0, 3).map((label) => {
                                        const labelName = typeof label === 'string' ? label : label.name;
                                        return (
                                            <span key={typeof label === 'string' ? label : label.id} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-white/10 text-muted-foreground">
                                                {labelName}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                            <Button size="icon" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0" asChild>
                                <a href={issue.html_url} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </Button>
                        </div>
                    ))
                ) : searched ? (
                    <div className="text-center py-12 text-muted-foreground">No issues found. Try a different query.</div>
                ) : null}
            </div>
        </div>
    )
}
