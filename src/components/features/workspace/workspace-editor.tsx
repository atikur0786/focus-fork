"use client"

import { useState } from "react"
import Editor from "@monaco-editor/react"
import { MonitorPlay, GitBranch, Terminal as TerminalIcon, Bot, FileCode, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface WorkspaceEditorProps {
    issueId: string;
}

export function WorkspaceEditor({ issueId }: WorkspaceEditorProps) {
    // Mock file tree
    const [files] = useState([
        { name: "src/app/page.tsx", language: "typescript", content: "// Main Landing Page\nexport default function Home() { ... }" },
        { name: "src/components/layout.tsx", language: "typescript", content: "// Layout Component\nexport const Layout = () => { ... }" },
        { name: "package.json", language: "json", content: "{\n  \"name\": \"project\",\n  \"version\": \"1.0.0\"\n}" },
        { name: "README.md", language: "markdown", content: "# Project Title\n\nDescription here." },
    ])
    const [activeFile, setActiveFile] = useState(files[0])

    return (
        <div className="flex h-[calc(100vh-6rem)] border border-border rounded-lg bg-card overflow-hidden text-sm">
            {/* Left Sidebar: File Explorer */}
            <div className="w-64 border-r border-border flex flex-col bg-muted/20">
                <div className="p-3 border-b border-border font-medium text-muted-foreground flex items-center gap-2">
                    <FileCode className="w-4 h-4" /> Explorer
                </div>
                <ScrollArea className="flex-1 p-2">
                    <div className="space-y-1">
                        {files.map((file) => (
                            <div
                                key={file.name}
                                className={`px-3 py-1.5 rounded-md cursor-pointer flex items-center gap-2 transition-colors ${activeFile.name === file.name ? "bg-primary/10 text-primary" : "hover:bg-muted/50 text-foreground/80"
                                    }`}
                                onClick={() => setActiveFile(file)}
                            >
                                <span className={`w-2 h-2 rounded-full ${file.language === 'typescript' ? 'bg-blue-400' : 'bg-yellow-400'}`} />
                                {file.name.split("/").pop()}
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                {/* AI Assistant Mini-Panel */}
                <div className="p-3 border-t border-border bg-muted/30">
                    <div className="flex items-center gap-2 text-xs font-semibold mb-2">
                        <Bot className="w-3 h-3 text-primary" />
                        Focus Coach
                    </div>
                    <div className="text-xs text-muted-foreground bg-background p-2 rounded border border-border">
                        "I suggest starting by checking the `page.tsx` file to understand the current layout structure."
                    </div>
                </div>
            </div>

            {/* Main Editor Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Editor Tabs / Header */}
                <div className="h-10 border-b border-border bg-muted/10 flex items-center px-4 justify-between">
                    <div className="flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground">{activeFile.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] h-5 bg-green-500/10 text-green-500 border-green-500/20 gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Connected
                        </Badge>
                    </div>
                </div>

                {/* Monaco Editor */}
                <div className="flex-1 relative bg-[#1e1e1e]">
                    <Editor
                        height="100%"
                        defaultLanguage={activeFile.language}
                        value={activeFile.content}
                        theme="vs-dark" // Force dark theme for "pro" feel
                        options={{
                            minimap: { enabled: false },
                            fontSize: 13,
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                        }}
                    />
                </div>

                {/* Bottom Terminal Panel (Collapsible) */}
                <div className="h-48 border-t border-border bg-[#0d0d0d] flex flex-col">
                    <div className="h-8 border-b border-white/10 flex items-center px-4 gap-4 text-xs font-medium text-muted-foreground bg-white/5">
                        <div className="flex items-center gap-1.5 text-foreground border-b border-primary h-full px-1">
                            <TerminalIcon className="w-3 h-3" /> Terminal
                        </div>
                        <div className="hover:text-foreground cursor-pointer transition-colors">Output</div>
                        <div className="hover:text-foreground cursor-pointer transition-colors">Problems</div>
                    </div>
                    <div className="flex-1 p-3 font-mono text-xs text-green-500/80 overflow-auto">
                        <div className="opacity-50">$ npm run dev</div>
                        <div className="text-white">{">"} focus-fork@0.1.0 dev</div>
                        <div className="text-white">{">"} next dev</div>
                        <br />
                        <div className="text-green-400">ready - started server on 0.0.0.0:3000, url: http://localhost:3000</div>
                        <div className="text-muted-foreground">event - compiled client and server successfully in 1241 ms (156 modules)</div>
                    </div>
                </div>
            </div>

            {/* Right Action Bar */}
            <div className="w-12 border-l border-border bg-muted/10 flex flex-col items-center py-4 gap-4">
                <div className="p-2 rounded-md hover:bg-muted cursor-pointer" title="Run Code">
                    <MonitorPlay className="w-5 h-5 text-muted-foreground hover:text-green-500 transition-colors" />
                </div>
                <div className="p-2 rounded-md hover:bg-muted cursor-pointer" title="Create Pull Request">
                    <GitBranch className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                </div>
            </div>
        </div>
    )
}
