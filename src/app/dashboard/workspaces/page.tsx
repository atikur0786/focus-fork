
export default function WorkspacesPage() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">My Workspaces</h1>
                <p className="text-muted-foreground">Manage your active contribution environments.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="border border-dashed border-white/20 rounded-xl h-48 flex items-center justify-center text-muted-foreground hover:bg-white/5 transition-colors cursor-pointer">
                    + New Workspace
                </div>
            </div>
        </div>
    )
}
