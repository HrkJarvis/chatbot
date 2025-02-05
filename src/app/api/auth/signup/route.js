import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { generateToken } from '../../../../lib/jwt';

const prisma = new PrismaClient();

const signupSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters')
});

export async function POST(request) {
    try {
        // Safely parse the request body
        const data = await request.json();
        
        // Log the incoming data for debugging
        console.log('Received signup data:', data);

        // Validate input with more robust parsing
        const validatedData = signupSchema.safeParse(data);

        // Check if validation failed
        if (!validatedData.success) {
            console.error('Validation errors:', validatedData.error.errors);
            return NextResponse.json(
                { 
                    error: 'Invalid signup data', 
                    details: validatedData.error.errors 
                }, 
                { status: 400 }
            );
        }

        // Use the parsed and validated data
        const { name, email, password } = validatedData.data;
        
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' }, 
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });

        // Generate JWT token
        const token = generateToken(user);

        // Set token in HTTP-only cookie
        const response = NextResponse.json({ 
            message: 'Signup successful',
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

        // Set secure, HTTP-only cookie
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 // 24 hours
        });

        return response;
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json(
            { error: 'Internal server error' }, 
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
