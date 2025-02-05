import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma'; // ✅ Use the singleton Prisma instance
import { verifyToken } from '../../../../lib/jwt';

export async function GET() {
    try {
        // ✅ Get token from cookies using Next.js App Router method
        const cookieStore = cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ user: null }, { status: 200 });
        }

        // ✅ Verify token
        const decoded = verifyToken(token);

        if (!decoded) {
            // Token is invalid or expired
            cookieStore.set('token', '', { maxAge: 0 }); // ✅ Correct way to delete the cookie
            return NextResponse.json({ user: null }, { status: 200 });
        }

        // ✅ Find user in DB
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true
            }
        });

        if (!user) {
            cookieStore.set('token', '', { maxAge: 0 }); // ✅ Remove token if user not found
            return NextResponse.json({ user: null }, { status: 200 });
        }

        return NextResponse.json({ user }, { status: 200 });

    } catch (error) {
        console.error('Session check error:', error);

        return NextResponse.json(
            { error: 'Something went wrong checking the session' }, 
            { status: 500 }
        );
    }
}

export async function POST() {
    // ✅ Logout route
    const cookieStore = cookies();
    cookieStore.set('token', '', { maxAge: 0 }); // ✅ Properly delete the cookie

    return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
}
