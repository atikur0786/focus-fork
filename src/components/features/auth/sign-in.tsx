
import { signIn } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"

export function SignIn() {
    return (
        <form
            action={async () => {
                "use server"
                await signIn("github", { redirectTo: "/dashboard" })
            }}
        >
            <Button variant="outline" className="gap-2" size="lg">
                <Github className="w-5 h-5" />
                Connect with GitHub
            </Button>
        </form>
    )
}
