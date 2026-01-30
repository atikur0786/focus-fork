
import { WorkspaceEditor } from "@/components/features/workspace/workspace-editor"

export default async function WorkspaceDetailPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>
    searchParams: Promise<{ repo?: string; issue?: string }>
}) {
    const { id } = await params
    const { repo, issue } = await searchParams

    return (
        <div className="animate-in fade-in duration-500">
            <WorkspaceEditor 
                issueId={id} 
                repo={repo}
                issueUrl={issue}
            />
        </div>
    )
}
