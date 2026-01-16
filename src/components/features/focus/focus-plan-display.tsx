
import { CheckCircle2 } from "lucide-react"

export function FocusPlanDisplay({ plan }: { plan: any }) {
    if (!plan) return null;

    return (
        <div className="border border-white/10 rounded-xl bg-card/20 p-6 animate-in slide-in-from-bottom-5 duration-500">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                Focus Plan
            </h3>
            <div className="space-y-3">
                {plan.step_by_step_plan.map((step: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
                        <div className="mt-1.5 w-4 h-4 rounded-full border border-muted-foreground/40 group-hover:border-primary transition-colors flex-shrink-0" />
                        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">{step}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
