"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { CheckCircle, Circle, GitBranch, Clock, Target, Rocket, Code2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface WorkflowStep {
    id: string
    title: string
    description: string
    status: "pending" | "in_progress" | "completed"
    action?: () => void
    actionText?: string
}

interface OpenSourceWorkflowProps {
    issueId: string
    repository?: { owner: string; name: string }
    onStepComplete?: (stepId: string) => void
}

export function OpenSourceWorkflow({ issueId, repository, onStepComplete }: OpenSourceWorkflowProps) {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(0)
    const [completedSteps, setCompletedSteps] = useState<string[]>([])

    const [steps, setSteps] = useState<WorkflowStep[]>([
        {
            id: "discover",
            title: "Discover Issue",
            description: "Find and select an issue to work on",
            status: "completed",
        },
        {
            id: "plan",
            title: "Create Plan",
            description: "Get AI-powered breakdown and success criteria",
            status: "completed",
        },
        {
            id: "fork",
            title: "Fork Repository",
            description: "Create your own copy of the repository",
            status: repository ? "completed" : "pending",
        },
        {
            id: "branch",
            title: "Create Branch",
            description: "Make a new branch for your changes",
            status: "pending",
        },
        {
            id: "code",
            title: "Implement Solution",
            description: "Write code in the integrated editor",
            status: "pending",
            actionText: "Open Editor",
            action: () => {
                if (repository) {
                    router.push(`/dashboard/workspaces/${issueId}?repo=${repository.owner}/${repository.name}`)
                }
            }
        },
        {
            id: "test",
            title: "Test Changes",
            description: "Verify your implementation works correctly",
            status: "pending",
        },
        {
            id: "pr",
            title: "Create Pull Request",
            description: "Submit your changes for review",
            status: "pending",
        },
    ])

    const progress = (completedSteps.length / steps.length) * 100

    const handleStepAction = (stepId: string) => {
        setCompletedSteps([...completedSteps, stepId])
        
        // Find the next step and mark it as in progress
        const currentIndex = steps.findIndex(step => step.id === stepId)
        if (currentIndex < steps.length - 1) {
            const nextStep = steps[currentIndex + 1]
            setSteps(prev => prev.map(step => 
                step.id === nextStep.id 
                    ? { ...step, status: "in_progress" as const }
                    : step
            ))
            setCurrentStep(currentIndex + 1)
        }
        
        if (onStepComplete) {
            onStepComplete(stepId)
        }
    }

    const getStepIcon = (step: WorkflowStep) => {
        if (step.status === "completed") {
            return <CheckCircle className="w-4 h-4 text-green-500" />
        } else if (step.status === "in_progress") {
            return <Circle className="w-4 h-4 text-blue-500 animate-pulse" />
        } else {
            return <Circle className="w-4 h-4 text-gray-400" />
        }
    }

    const getStepStatus = (step: WorkflowStep) => {
        if (completedSteps.includes(step.id)) return "completed"
        if (step.id === steps[currentStep]?.id) return "in_progress"
        return "pending"
    }

    const estimatedTotalTime = 45 // minutes
    const estimatedStepsLeft = steps.length - completedSteps.length
    const estimatedTimeRemaining = Math.max(0, estimatedTotalTime * (estimatedStepsLeft / steps.length))

    return (
        <Card className="w-full">
            <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Open Source Workflow
                </CardTitle>
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            {completedSteps.length}/{steps.length} completed
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            ~{Math.round(estimatedTimeRemaining)}min remaining
                        </span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                {steps.map((step, index) => (
                    <div
                        key={step.id}
                        className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                            getStepStatus(step) === "in_progress" 
                                ? "border-primary/50 bg-primary/5" 
                                : getStepStatus(step) === "completed"
                                ? "border-green-500/20 bg-green-500/5"
                                : "border-border"
                        }`}
                    >
                        <div className="flex-shrink-0 mt-0.5">
                            {getStepIcon(step)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                                <h4 className="text-sm font-medium">{step.title}</h4>
                                {getStepStatus(step) === "in_progress" && (
                                    <Badge variant="outline" className="text-xs">
                                        Current
                                    </Badge>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">{step.description}</p>
                            
                            {step.action && step.actionText && step.status === "pending" && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-xs h-7"
                                    onClick={() => {
                                        step.action?.()
                                        handleStepAction(step.id)
                                    }}
                                >
                                    {step.actionText}
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
                
                {/* Quick Actions */}
                <div className="pt-3 border-t border-border">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Quick Actions</span>
                        <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="text-xs h-7">
                                <Code2 className="w-3 h-3 mr-1" />
                                Open Editor
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs h-7">
                                <GitBranch className="w-3 h-3 mr-1" />
                                View PRs
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}