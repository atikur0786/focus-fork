
import { WorkspaceEditor } from "@/components/features/workspace/workspace-editor"

export default async function WorkspaceDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params

    return (
        <div className="animate-in fade-in duration-500">
            <WorkspaceEditor issueId={id} />
        </div>
    )
}
