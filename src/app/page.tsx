import { auth } from "@/lib/auth"
import { SignIn } from "@/components/features/auth/sign-in"
import { UserNav } from "@/components/features/auth/user-nav"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { GitBranch, GitMerge, Search, ArrowRight, Code, Zap, Shield, GitFork } from "lucide-react"
import { ScrollHeader } from "@/components/features/landing/scroll-header"
import { SiteFooter } from "@/components/features/landing/site-footer"
import { ThemeToggle } from "@/components/theme-toggle"

export default async function Home() {
  const session = await auth()

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans selection:bg-white/20">

      <ScrollHeader>
        {/* Left: Brand */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-medium tracking-tight text-foreground">
            FocusFork
          </span>
          <span className="hidden md:inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
            Beta
          </span>
        </div>

        {/* Right: Nav + Actions */}
        <nav className="flex items-center gap-6">
          <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden md:block">Process</Link>

          <div className="flex items-center gap-2 pl-4 border-l border-border/40 ml-2">
            <ThemeToggle />
            {session?.user ? (
              <>
                <Link href="/dashboard" className="hidden md:block">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    Dashboard
                  </Button>
                </Link>
                <UserNav user={session.user} />
              </>
            ) : (
              <SignIn />
            )}
          </div>
        </nav>
      </ScrollHeader>

      <main className="flex-1">
        {/* Hero Section - Scientific/Minimalist */}
        <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 px-4">
          {/* Subtle background glow, not overwhelming */}
          <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

          <div className="container px-4 md:px-6 relative z-10 max-w-5xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight text-foreground mb-8 leading-[1.1]">
              Focus on the <br />
              <span className="text-muted-foreground/80">contribution.</span>
            </h1>

            <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed font-light mb-12">
              We combine AI-driven issue discovery with deep work tools to help you navigate the open source ecosystem with precision and clarity.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="h-12 px-8 rounded-full text-base bg-white text-black hover:bg-white/90 font-medium" asChild>
                <Link href="/dashboard">Start Contributing</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Introduction / Statement */}
        <section className="py-24 border-t border-white/5">
          <div className="container px-4 md:px-6 max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-start">
              <div>
                <h2 className="text-3xl font-normal text-foreground mb-6">The noise is deafening.</h2>
              </div>
              <div className="space-y-6 text-muted-foreground font-light text-lg leading-relaxed">
                <p>
                  Modern software development is plagued by context switching. Developers spend more time deciding <em>what</em> to do than actually doing it.
                </p>
                <p>
                  FocusFork acts as your cognitive filter. We scout the vast GitHub landscape to find issues that match your exact profile, then structure your environment for a state of deep flow.
                </p>
              </div>
            </div>
          </div>
        </section>


        {/* Process Steps (Timeline Style) */}
        <section id="features" className="py-32 border-t border-white/5">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="mb-20">
              <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-4 block">Methodology</span>
              <h2 className="text-4xl font-normal text-foreground">The Sync Cycle</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              {[
                { step: "01", title: "Scout", desc: "Algorithmic discovery of issues tailored to your stack and skill level." },
                { step: "02", title: "Focus", desc: "A distraction-free interface with AI-guided planning and time management." },
                { step: "03", title: "Merge", desc: "Automated context generation for Pull Requests to streamline review." }
              ].map((item, i) => (
                <div key={i} className="border-t border-white/20 pt-8 group cursor-default">
                  <span className="text-sm font-mono text-muted-foreground mb-4 block group-hover:text-primary transition-colors">{item.step}</span>
                  <h3 className="text-2xl font-light text-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground font-light leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <SiteFooter />
    </div>
  )
}
