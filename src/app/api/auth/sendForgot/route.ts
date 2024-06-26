import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/db/read/user';
import jwt from "jsonwebtoken";
import checkPassword  from '@/app/api/utils/checkPassword';

export async function POST(request: NextRequest) {
    const {email} = await request.json();

    let user = await getUser({email}); // Check if email exists

    if (!user) {
        user = await getUser({email}); // Check if username exists

        if (!user) {
            return NextResponse.json({ "error": "User not found" }); // If neither email nor username exists, return error
        }
    }

    const hashedUser = user.username; //get pass

    // Ensure JWT_SECRET is defined
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }

    // Generate JWT token
    const token = jwt.sign({ userID: user._id, type: 'user' }, process.env.JWT_SECRET, {
        expiresIn: '100m',
    });

    return NextResponse.json({ "token": token });
}
