import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { generateToken } from '../../../../lib/jwt';
import { cookies } from 'next/headers'; // ✅ Keep this, now correctly used

const prisma = new PrismaClient();

const loginSchema = z.object({
    email: z.string({ 
        required_error: 'Email is required',
        invalid_type_error: 'Email must be a string'
    }).email('Invalid email address'),
    password: z.string({ 
        required_error: 'Password is required',
        invalid_type_error: 'Password must be a string'
    }).min(1, 'Password cannot be empty')
});

export async function POST(request) {
    try {
        const data = await request.json();
        console.log('Received login data:', data);

        const validatedData = loginSchema.safeParse(data);

        if (!validatedData.success) {
            console.error('Validation errors:', validatedData.error.errors);
            return NextResponse.json(
                { 
                    error: 'Invalid login data', 
                    details: validatedData.error.errors 
                }, 
                { status: 400 }
            );
        }

        const { email, password } = validatedData.data;
        
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid email or password' }, 
                { status: 401 }
            );
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'Invalid email or password' }, 
                { status: 401 }
            );
        }

        // ✅ Generate JWT token
        const token = generateToken(user);

        // ✅ Set token using `cookies()`
        cookies().set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 // 24 hours
        });

        return NextResponse.json({ 
            message: 'Login successful',
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' }, 
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
