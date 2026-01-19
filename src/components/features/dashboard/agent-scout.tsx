"use client";

import { useChat } from "ai/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, User, Send, ArrowRight, Loader2 } from "lucide-react";
import { useRef, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface ToolInvocation {
    toolCallId: string;
    toolName: string;
    state: string;
    result?: any[];
}

interface Message {
    id: string;
    role: "user" | "assistant" | "system" | "data";
    content: string;
    toolInvocations?: ToolInvocation[];
}

export function AgentScout() {
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: "/api/chat",
        initialMessages: [
            {
                id: "welcome",
                role: "assistant",
                content: "Hi! I'm your Issue Scout. Tell me what kind of technology you're interested in, and I'll find you a great first issue to tackle.",
            }
        ],
    });

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="flex flex-col h-full border border-border rounded-xl bg-card overflow-hidden shadow-sm">
            <div className="bg-muted/30 p-4 border-b border-border flex items-center gap-2">
                <div className="p-1.5 bg-primary/10 rounded-lg">
                    <Bot className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <h3 className="font-semibold text-sm">FocusFork Agent</h3>
                    <p className="text-xs text-muted-foreground">AI-Powered Issue Discovery</p>
                </div>
            </div>

            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                <div className="space-y-4 max-w-3xl mx-auto">
                    {messages.map((m) => (
                        <div
                            key={m.id}
                            className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                        >
                            <Avatar className="h-8 w-8 mt-1">
                                {m.role === "assistant" ? (
                                    <>
                                        <AvatarImage src="/bot-avatar.png" />
                                        <AvatarFallback className="bg-primary/10 text-primary"><Bot className="w-4 h-4" /></AvatarFallback>
                                    </>
                                ) : (
                                    <>
                                        <AvatarFallback className="bg-muted text-muted-foreground"><User className="w-4 h-4" /></AvatarFallback>
                                    </>
                                )}
                            </Avatar>

                            <div className={`flex flex-col gap-2 max-w-[80%]`}>
                                <div
                                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.role === "user"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted/50 text-foreground border border-border/50"
                                        }`}
                                >
                                    {m.content}
                                </div>

                                {/* Render Tool Invocations (Issues) if present */}
                                {m.toolInvocations?.map((toolInvocation: ToolInvocation) => {
                                    if (toolInvocation.toolName === 'searchIssues' && toolInvocation.state === 'result' && toolInvocation.result) {
                                        const issues = toolInvocation.result;
                                        return (
                                            <div key={toolInvocation.toolCallId} className="grid gap-2 mt-2">
                                                {issues.map((issue: any) => (
                                                    <div key={issue.id} className="p-3 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors group">
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div>
                                                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                                                                    <span className="font-medium text-foreground">{issue.repo}</span>
                                                                    <span>#{issue.number}</span>
                                                                </div>
                                                                <h4 className="font-medium text-sm line-clamp-2 mb-2">{issue.title}</h4>
                                                                <div className="flex gap-1.5 flex-wrap">
                                                                    {issue.labels.slice(0, 3).map((label: string) => (
                                                                        <Badge key={label} variant="secondary" className="text-[10px] h-5 px-1.5">{label}</Badge>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <Link href={`/dashboard/workspaces/${issue.number}?issueUrl=${encodeURIComponent(issue.html_url)}`}>
                                                                <Button size="sm" variant="outline" className="h-8 text-xs shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                                                    Start <ArrowRight className="w-3 h-3 ml-1" />
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )
                                    }
                                    return null;
                                })}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex gap-3">
                            <Avatar className="h-8 w-8 mt-1">
                                <AvatarFallback className="bg-primary/10 text-primary"><Bot className="w-4 h-4" /></AvatarFallback>
                            </Avatar>
                            <div className="bg-muted/50 rounded-2xl px-4 py-3 border border-border/50 flex items-center">
                                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>

            <form onSubmit={handleSubmit} className="p-4 bg-background border-t border-border">
                <div className="relative max-w-3xl mx-auto flex items-center gap-2">
                    <Input
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Type a message (e.g. 'Show me beginner React issues')..."
                        className="h-12 pl-4 pr-12 rounded-xl bg-muted/30 border-muted-foreground/20 focus-visible:ring-primary/20"
                    />
                    <Button
                        type="submit"
                        size="icon"
                        className="absolute right-1.5 h-9 w-9 rounded-lg transition-transform hover:scale-105 active:scale-95"
                        disabled={isLoading || !input.trim()}
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </form>
        </div>
    );
}
