import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/admin');
            const isOnCatalog = nextUrl.pathname.startsWith('/catalog') || nextUrl.pathname.startsWith('/products') || nextUrl.pathname.startsWith('/cart');

            if (isOnDashboard) {
                // @ts-ignore - role is added to user type
                if (isLoggedIn && auth?.user?.role === 'ADMIN') return true;
                return false; // Redirect unauthenticated users to login page
            }

            if (isOnCatalog) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            }

            return true;
        },
        // @ts-ignore
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        },
        // @ts-ignore
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
            }
            return session;
        }
    },
    providers: [], // Configured in auth.ts
} satisfies NextAuthConfig;
