import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

export async function POST() {  // Removed 'request' parameter as it's not used
    try {
        // Get the current user's token from cookies
        const cookieStore = cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ 
                message: 'No active session found',
                shouldRelogin: true
            }, { 
                status: 401 
            });
        }

        // Invalidate the session in the database (if applicable)
        try {
            const updatedSession = await prisma.session.updateMany({
                where: { 
                    token: token,
                    isActive: true 
                },
                data: { 
                    isActive: false,
                    endedAt: new Date() 
                }
            });

            if (updatedSession.count === 0) {
                console.warn('No active session found in DB for token:', token);
            }
        } catch (dbError) {
            console.error('Database session update error:', dbError);
        }

        // ✅ Correct way to clear cookies in Next.js App Router
        cookieStore.set('token', '', { maxAge: 0 });
        cookieStore.set('user', '', { maxAge: 0 });
        cookieStore.set('session', '', { maxAge: 0 });

        return NextResponse.json({ 
            message: 'Session ended successfully. Please log in again.',
            shouldRelogin: true
        }, { 
            status: 200 
        });
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json({ 
            message: 'Failed to end session. Please try again.',
            shouldRelogin: true,
            error: error.message 
        }, { 
            status: 500 
        });
    }
}
