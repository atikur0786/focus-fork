
import { auth } from "@/lib/auth"
import { SignIn } from "@/components/features/auth/sign-in"
import { UserNav } from "@/components/features/auth/user-nav"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Terminal, GitBranch, GitMerge, Search, ArrowRight, Code } from "lucide-react"

export default async function Home() {
  const session = await auth()

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/20">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container flex h-14 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
              FocusFork
            </span>
            <span className="hidden md:inline-flex items-center rounded-full border border-border bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
              Beta
            </span>
          </div>
          <nav className="flex items-center gap-4">
            {session?.user ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    Dashboard
                  </Button>
                </Link>
                <UserNav user={session.user} />
              </div>
            ) : (
              <SignIn />
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24">
          {/* Background Mesh Gradient */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-50 blur-3xl pointer-events-none" />

          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center text-center space-y-8">
              <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-muted-foreground backdrop-blur-md">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                v1.0 is now live
              </div>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
                Contribute to Open Source without leaving your browser.
              </h1>

              <p className="max-w-[700px] text-muted-foreground md:text-xl leading-relaxed">
                FocusFork searches thousands of repositories to find the perfect issue for your skills.
                Chat, fork, and request merge—all in one flow.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 min-w-[200px]">
                {session?.user ? (
                  <Link href="/dashboard">
                    <Button size="lg" className="rounded-full px-8 text-base h-12 shadow-[0_0_20px_-5px_rgba(124,58,237,0.5)] transition-all hover:shadow-[0_0_30px_-5px_rgba(124,58,237,0.6)]">
                      Enter Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <SignIn />
                )}
                <Button variant="outline" size="lg" className="rounded-full px-8 h-12 border-white/10 hover:bg-white/5">
                  View Source Code
                </Button>
              </div>
            </div>

            {/* Terminal Mockup */}
            <div className="mt-16 mx-auto max-w-4xl glass rounded-xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-10 duration-1000">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="ml-4 text-xs text-muted-foreground font-mono">focus-fork-agent — zsh</div>
              </div>
              <div className="p-6 font-mono text-sm space-y-4 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-green-400">➜</span>
                  <span className="text-blue-400">~</span>
                  <span className="text-muted-foreground">scout issues --lang typescript --level beginner</span>
                </div>
                <div className="space-y-2 text-muted-foreground">
                  <div className="flex gap-2">
                    <span className="text-primary">ℹ</span>
                    <span>Scanning GitHub repositories... found 12 matches.</span>
                  </div>
                  <div className="flex gap-2 text-white">
                    <span className="text-green-400">✔</span>
                    <span>Best Match: <span className="underline decoration-muted-foreground/30">facebook/react #12345</span></span>
                  </div>
                  <div className="pl-6 border-l-2 border-white/10 my-2">
                    <p>"Fix memory leak in useEffect cleanup"</p>
                    <p className="text-xs mt-1 text-muted-foreground">Impact: High • Difficulty: Easy • Language: TypeScript</p>
                  </div>
                  <div className="flex gap-2 animate-pulse">
                    <span className="text-primary">?</span>
                    <span>Would you like to start a focus session for this issue? (Y/n)</span>
                    <span className="w-2 h-4 bg-white block"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sync Experience Grid */}
        <section className="py-24 border-t border-white/5">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">The Sync Experience</h2>
              <p className="text-muted-foreground">From discovery to deployment in three steps.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-4 border border-white/10 text-primary">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">1. Scout</h3>
                  <p className="text-sm text-muted-foreground">
                    Our Agent scans thousands of issues to find one that matches your exact skill level and available time.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-4 border border-white/10 text-blue-400">
                    <Code className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">2. Focus</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter a distraction-free environment. Use the built-in timer and AI pairing partner to stay on track.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-4 border border-white/10 text-green-400">
                    <GitMerge className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">3. Merge</h3>
                  <p className="text-sm text-muted-foreground">
                    Generate a PR description with one click and submit your contribution directly from the dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Markers */}
        <section className="py-16 border-t border-white/5 bg-white/[0.02]">
          <div className="container px-4 text-center">
            <p className="text-sm font-medium text-muted-foreground mb-8 uppercase tracking-widest">Supported Platforms</p>
            <div className="flex justify-center items-center gap-12 grayscale opacity-50 hover:opacity-100 transition-opacity duration-500">
              {/* Simple Text Placeholders for Logos as SVG importing can be tricky without assets */}
              <span className="text-2xl font-bold">GitHub</span>
              <span className="text-2xl font-bold">GitLab</span>
              <span className="text-2xl font-bold">Bitbucket</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-8 text-center text-sm text-muted-foreground">
        <p>© 2026 FocusFork. Built for the Hackathon.</p>
      </footer>
    </div>
  )
}
