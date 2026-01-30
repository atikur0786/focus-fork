"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User, Send, ArrowRight, Loader2 } from "lucide-react";
import { useRef, useEffect } from "react";
import { GitHubIssue } from "@/lib/github/scout";
import { searchPublicIssuesAction } from "@/app/actions";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
}

interface AgentScoutProps {
    selectedIssue?: GitHubIssue | null;
}

export function AgentScout({ selectedIssue }: AgentScoutProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "assistant",
            content: "Hi! I'm your Issue Scout. Select an issue from the left panel to get started, or ask me to find one for you.",
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Sync selected issue with Agent Context
    useEffect(() => {
        if (selectedIssue) {
            setMessages(prev => [
                ...prev,
                {
                    id: `issue-${selectedIssue.id}`,
                    role: "assistant",
                    content: `Great choice! Issue #${selectedIssue.number}: "${selectedIssue.title}" looks interesting. This appears to be in a ${selectedIssue.repository_url.replace("https://api.github.com/repos/", "")} repository.\n\nReady to start working? I can help you create a plan and set up your workspace.`,
                }
            ]);
        }
    }, [selectedIssue]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input,
        };

        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            // Simple responses for demo
            let response = "";
            const lowerInput = input.toLowerCase();

            if (lowerInput.includes("react") || lowerInput.includes("beginner")) {
                const issues = await searchPublicIssuesAction("react beginner");
                response = `I found ${issues.length} beginner-friendly React issues! Here are some recent ones:\n\n` +
                    issues.slice(0, 3).map((issue: any) => 
                        `• #${issue.number}: ${issue.title}\n`
                    ).join('') +
                    "\nClick on any issue in the left panel to start working on it!";
            } else if (lowerInput.includes("help")) {
                response = "I can help you:\n\n• Find issues based on technology (e.g., 'React issues')\n• Filter by difficulty (e.g., 'beginner TypeScript')\n• Guide you through the contribution process\n\nWhat would you like to work on?";
            } else if (lowerInput.includes("how")) {
                response = "Here's how it works:\n\n1. **Discover**: Find an issue you're interested in\n2. **Plan**: I'll help break it down into manageable steps\n3. **Fork**: Create your own copy of the repository\n4. **Code**: Edit files in the integrated editor\n5. **Submit**: Create a pull request\n\nReady to start?";
            } else {
                response = "I can help you find open source issues to contribute to! Try asking for:\n\n• 'React beginner issues'\n• 'TypeScript help wanted'\n• 'Python good first issue'\n\nOr select an issue from the left panel to get started.";
            }

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: response,
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "Sorry, I encountered an error. Please try again.",
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

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
                                    <AvatarFallback className="bg-primary/10 text-primary">
                                        <Bot className="w-4 h-4" />
                                    </AvatarFallback>
                                ) : (
                                    <AvatarFallback className="bg-muted text-muted-foreground">
                                        <User className="w-4 h-4" />
                                    </AvatarFallback>
                                )}
                            </Avatar>

                            <div className={`flex flex-col gap-2 max-w-[80%]`}>
                                <div
                                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                                        m.role === "user"
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted/50 text-foreground border border-border/50"
                                    }`}
                                >
                                    {m.content.split('\n').map((line, index) => (
                                        <div key={index}>
                                            {line || '\u00A0'}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex gap-3">
                            <Avatar className="h-8 w-8 mt-1">
                                <AvatarFallback className="bg-primary/10 text-primary">
                                    <Bot className="w-4 h-4" />
                                </AvatarFallback>
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
                        onChange={(e) => setInput(e.target.value)}
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