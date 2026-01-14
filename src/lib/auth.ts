import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [GitHub],
    theme: {
        logo: "/logo.png", // We can add this later
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')

            if (isOnDashboard) {
                if (isLoggedIn) return true
                return false // Redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                // Optional: Redirect logged-in users away from landing page
                // if (nextUrl.pathname === '/') {
                //   return Response.redirect(new URL('/dashboard', nextUrl))
                // }
            }
            return true
        },
    },
})
