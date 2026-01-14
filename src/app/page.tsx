
import { auth } from "@/lib/auth"
import { SignIn } from "@/components/features/auth/sign-in"
import { UserNav } from "@/components/features/auth/user-nav"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function Home() {
  const session = await auth()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-black dark:bg-black dark:text-white transition-colors duration-300">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400">
              FocusFork
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              The intelligent companion for open source contributors.
              Find issues, plan sessions, and maintain your flow state.
            </p>
          </div>

          <div className="flex flex-col gap-4 min-h-[100px] justify-center">
            {session?.user ? (
              <div className="flex flex-col items-center gap-4">
                <p className="text-lg font-medium">
                  Welcome back, {session.user.name?.split(" ")[0]}
                </p>
                <div className="flex gap-4">
                  <Link href="/dashboard">
                    <Button size="lg" className="px-8">
                      Enter Dashboard
                    </Button>
                  </Link>
                  <UserNav user={session.user} />
                </div>
              </div>
            ) : (
              <SignIn />
            )}
          </div>
        </div>
      </div>

      <footer className="absolute bottom-8 text-sm text-gray-500 dark:text-gray-400">
        <p>Built for the hackathon. 100% Open Source.</p>
      </footer>
    </div>
  )
}
