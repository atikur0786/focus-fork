
import { Info } from "lucide-react"

export function CoachPanel({ plan }: { plan: any }) {
    if (!plan) return null;

    return (
        <div className="glass-card rounded-xl p-5 h-full border-l-4 border-l-primary/50 animate-in slide-in-from-right-5 duration-700">
            <h3 className="font-semibold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider text-muted-foreground">
                Focus Coach
            </h3>
            <div className="space-y-4 text-sm">
                <div className="bg-primary/10 p-4 rounded-lg text-primary-foreground/90 border border-primary/20">
                    <p className="leading-relaxed">
                        <strong>Mission:</strong> {plan.summary}
                    </p>
                </div>
                <div className="text-muted-foreground italic">
                    <p>Estimated time: <strong>{plan.estimated_time_minutes} minutes</strong>. Deep work only.</p>
                </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
                <h4 className="text-xs font-semibold text-muted-foreground mb-3 uppercase flex items-center gap-2">
                    <Info className="w-3 h-3" />
                    Success Criteria
                </h4>
                <ul className="space-y-2 text-xs text-muted-foreground/80 list-disc pl-4">
                    {plan.success_criteria.map((criteria: string, i: number) => (
                        <li key={i}>{criteria}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
