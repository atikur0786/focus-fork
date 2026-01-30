"use client"

import { useState, useEffect } from "react"
import Editor from "@monaco-editor/react"
import { MonitorPlay, GitBranch, Terminal as TerminalIcon, Bot, FileCode, CheckCircle2, FolderOpen, Save, GitPullRequest, GitFork } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { extractRepoInfoFromUrl, forkRepositoryAction, getRepositoryContentsAction, getFileContentAction, updateFileAction, createFileAction, createBranchAction, createPullRequestAction } from "@/app/actions"
import { PullRequestManager } from "./pr-manager"
import { CommitManager } from "./commit-manager"

interface WorkspaceEditorProps {
    issueId: string;
    repo?: string;
    issueUrl?: string;
}

interface RepoFile {
    name: string;
    path: string;
    type: "file" | "dir";
    content?: string;
    sha?: string;
    language?: string;
}

interface Repository {
    owner: string;
    name: string;
    defaultBranch: string;
}

export function WorkspaceEditor({ issueId, repo, issueUrl }: WorkspaceEditorProps) {
    const [repository, setRepository] = useState<Repository | null>(null);
    const [files, setFiles] = useState<RepoFile[]>([]);
    const [activeFile, setActiveFile] = useState<RepoFile | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isForking, setIsForking] = useState(false);
    const [branchName, setBranchName] = useState("focus-work");
    const [forkedRepo, setForkedRepo] = useState<Repository | null>(null);
    const [isCreatingPR, setIsCreatingPR] = useState(false);

    // Initialize repository from props
    useEffect(() => {
        const initRepo = async () => {
            try {
                if (repo) {
                    const [owner, name] = repo.split('/');
                    const repository: Repository = {
                        owner,
                        name,
                        defaultBranch: "main" // This could be fetched from GitHub API
                    };
                    
                    setRepository(repository);
                    await loadRepositoryFiles(repository);
                } else if (issueUrl) {
                    const repoInfo = await extractRepoInfoFromUrl(issueUrl);
                    if (repoInfo) {
                        const repository: Repository = {
                            owner: repoInfo.owner,
                            name: repoInfo.repo,
                            defaultBranch: "main"
                        };
                        
                        setRepository(repository);
                        await loadRepositoryFiles(repository);
                    }
                } else {
                    // Fallback to mock repo for testing
                    const mockRepo: Repository = {
                        owner: "microsoft",
                        name: "vscode",
                        defaultBranch: "main"
                    };
                    
                    setRepository(mockRepo);
                    await loadRepositoryFiles(mockRepo);
                }
            } catch (error) {
                console.error("Error initializing repository:", error);
            }
        };
        
        initRepo();
    }, [issueId, repo, issueUrl]);

    const loadRepositoryFiles = async (repo: Repository) => {
        setIsLoading(true);
        try {
            const contents = await getRepositoryContentsAction(repo.owner, repo.name);
            const fileTree = await buildFileTree(contents, repo.owner, repo.name);
            setFiles(fileTree);
            if (fileTree.length > 0 && fileTree[0].type === "file") {
                setActiveFile(fileTree[0]);
            }
        } catch (error) {
            console.error("Error loading repository files:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const buildFileTree = async (contents: any[], owner: string, repo: string, path: string = ""): Promise<RepoFile[]> => {
        const result: RepoFile[] = [];
        
        for (const item of contents) {
            if (item.type === "file") {
                const content = await getFileContentAction(owner, repo, item.path);
                result.push({
                    name: item.name,
                    path: item.path,
                    type: "file",
                    content: content.content,
                    sha: content.sha,
                    language: getLanguageFromPath(item.name)
                });
            } else if (item.type === "dir") {
                try {
                    const subContents = await getRepositoryContentsAction(owner, repo, item.path);
                    const subFiles = await buildFileTree(subContents, owner, repo, item.path);
                    result.push({
                        name: item.name,
                        path: item.path,
                        type: "dir"
                    });
                    result.push(...subFiles);
                } catch (error) {
                    console.error(`Error loading directory ${item.path}:`, error);
                }
            }
        }
        
        return result;
    };

    const getLanguageFromPath = (path: string): string => {
        const ext = path.split('.').pop()?.toLowerCase();
        const languageMap: { [key: string]: string } = {
            'ts': 'typescript',
            'tsx': 'typescript',
            'js': 'javascript',
            'jsx': 'javascript',
            'py': 'python',
            'go': 'go',
            'rs': 'rust',
            'java': 'java',
            'cpp': 'cpp',
            'c': 'c',
            'cs': 'csharp',
            'php': 'php',
            'rb': 'ruby',
            'swift': 'swift',
            'kt': 'kotlin',
            'scala': 'scala',
            'html': 'html',
            'css': 'css',
            'scss': 'scss',
            'sass': 'sass',
            'json': 'json',
            'xml': 'xml',
            'yaml': 'yaml',
            'yml': 'yaml',
            'toml': 'toml',
            'md': 'markdown',
            'sql': 'sql',
            'sh': 'shell',
            'zsh': 'shell',
            'bash': 'shell',
            'dockerfile': 'dockerfile',
        };
        return languageMap[ext || ''] || 'plaintext';
    };

    const handleForkRepository = async () => {
        if (!repository) return;
        
        setIsForking(true);
        try {
            const forked = await forkRepositoryAction(repository.owner, repository.name);
            const forkedRepo: Repository = {
                owner: forked.owner.login,
                name: forked.name,
                defaultBranch: forked.default_branch
            };
            setForkedRepo(forkedRepo);
            
            // Create a new branch for the work
            await createBranchAction(forkedRepo.owner, forkedRepo.name, branchName, forkedRepo.defaultBranch);
            
            // Load the forked repository files
            await loadRepositoryFiles(forkedRepo);
        } catch (error) {
            console.error("Error forking repository:", error);
        } finally {
            setIsForking(false);
        }
    };

    const handleSaveFile = async () => {
        if (!activeFile || !forkedRepo || !activeFile.content) return;
        
        try {
            if (activeFile.sha) {
                await updateFileAction(
                    forkedRepo.owner,
                    forkedRepo.name,
                    activeFile.path,
                    activeFile.content || "",
                    `Update ${activeFile.name}`,
                    activeFile.sha,
                    branchName
                );
            } else {
                await createFileAction(
                    forkedRepo.owner,
                    forkedRepo.name,
                    activeFile.path,
                    activeFile.content || "",
                    `Create ${activeFile.name}`,
                    branchName
                );
            }
        } catch (error) {
            console.error("Error saving file:", error);
        }
    };

    const handleCreatePullRequest = async () => {
        if (!repository || !forkedRepo) return;
        
        setIsCreatingPR(true);
        try {
            const pr = await createPullRequestAction(
                repository.owner,
                repository.name,
                `Fix #${issueId}: Implement feature`,
                "This PR addresses the issue and implements the necessary changes.",
                `${forkedRepo.owner}:${branchName}`,
                repository.defaultBranch
            );
            
            // In a real app, you'd navigate to the PR or show a success message
            console.log("Pull request created:", pr.html_url);
        } catch (error) {
            console.error("Error creating pull request:", error);
        } finally {
            setIsCreatingPR(false);
        }
    };

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
                            className={`px-3 py-1.5 rounded-md cursor-pointer flex items-center gap-2 transition-colors ${activeFile?.name === file.name ? "bg-primary/10 text-primary" : "hover:bg-muted/50 text-foreground/80"
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
                <div className="p-3 border-t border-border bg-muted/30 space-y-3">
                    {/* Repository Info */}
                    {repository && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs font-semibold">
                                <FolderOpen className="w-3 h-3 text-primary" />
                                Repository
                            </div>
                            <div className="text-xs text-muted-foreground bg-background p-2 rounded border border-border">
                                <div className="font-medium text-foreground">{repository.owner}/{repository.name}</div>
                                <div className="text-[10px]">Branch: {branchName}</div>
                            </div>
                        </div>
                    )}

                    {/* Fork Repository Button */}
                    {!forkedRepo && repository && (
                        <Button 
                            onClick={handleForkRepository}
                            disabled={isForking}
                            className="w-full text-xs h-8"
                            variant="default"
                        >
                            <GitFork className="w-3 h-3 mr-1" />
                            {isForking ? "Forking..." : "Fork Repository"}
                        </Button>
                    )}

                    {/* Commits */}
                    {forkedRepo && (
                        <div className="space-y-2">
                            <CommitManager owner={forkedRepo.owner} repo={forkedRepo.name} branch={branchName} />
                        </div>
                    )}

                    {/* Pull Requests */}
                    {repository && (
                        <div className="space-y-2">
                            <PullRequestManager owner={repository.owner} repo={repository.name} />
                        </div>
                    )}

                    {/* AI Assistant Mini-Panel */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs font-semibold">
                            <Bot className="w-3 h-3 text-primary" />
                            Focus Coach
                        </div>
                        <div className="text-xs text-muted-foreground bg-background p-2 rounded border border-border">
                            {forkedRepo ? 
                                "Repository forked! Start editing files and create a PR when ready." :
                                "Fork the repository to begin making changes."
                            }
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Editor Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Editor Tabs / Header */}
                <div className="h-10 border-b border-border bg-muted/10 flex items-center px-4 justify-between">
                    <div className="flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground">{activeFile?.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {forkedRepo && (
                            <Badge variant="outline" className="text-[10px] h-5 bg-blue-500/10 text-blue-500 border-blue-500/20 gap-1">
                                <GitFork className="w-3 h-3" /> Forked
                            </Badge>
                        )}
                        <Button
                            onClick={handleSaveFile}
                            disabled={!activeFile || !forkedRepo}
                            className="text-xs h-5 px-2"
                            variant="ghost"
                            size="sm"
                        >
                            <Save className="w-3 h-3 mr-1" />
                            Save
                        </Button>
                    </div>
                </div>

                {/* Monaco Editor */}
                <div className="flex-1 relative bg-[#1e1e1e]">
                    <Editor
                        height="100%"
                        defaultLanguage={activeFile?.language || "plaintext"}
                        value={activeFile?.content || ""}
                        theme="vs-dark" // Force dark theme for "pro" feel
                        options={{
                            minimap: { enabled: false },
                            fontSize: 13,
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                        }}
                        onChange={(value) => {
                            if (activeFile && value !== undefined) {
                                setActiveFile({ ...activeFile, content: value });
                            }
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
                {forkedRepo && (
                    <div className="p-2 rounded-md hover:bg-muted cursor-pointer" title="Create Pull Request" onClick={handleCreatePullRequest}>
                        <GitPullRequest className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                    </div>
                )}
            </div>
        </div>
    )
}
