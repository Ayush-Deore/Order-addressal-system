import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import type { User } from '@prisma/client';

async function getUser(email: string): Promise<User | null> {
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        return user;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);
                    if (!user) return null;

                    // Verify password
                    // Note: In seed, we used a hardcoded hash. In real app, bcrypt.compare is needed.
                    // If the hash in DB is not a valid bcrypt hash, this might fail or error.
                    // We assume seed data is valid.
                    const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
                    if (passwordsMatch) return user;
                }
                console.log('Invalid credentials');
                return null;
            },
        }),
    ],

});
