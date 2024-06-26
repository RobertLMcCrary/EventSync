import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/db/read/user';
import jwt from "jsonwebtoken";
import checkPassword  from '@/app/api/utils/checkPassword';

export async function POST(request: NextRequest) {
    const {username, password} = await request.json();

    let user = await getUser({email: username}); // Check if email exists

    if (!user) {
        user = await getUser({username}); // Check if username exists

        if (!user) {
            return NextResponse.json({error: "User not found"}, {status: 404}); // If neither email nor username exists, return error
        }
    }


    const hashedPassword = user.password; //get pass

    if (!hashedPassword) {
        return NextResponse.json({error: "Please login with your provider and create a password to use email login"}, {status: 400});
    }

    const passwordMatch = await checkPassword(password, hashedPassword); //pass check
    if (!passwordMatch) {
        return NextResponse.json({error: "Password incorrect"}, {status: 400});
    }

    // Ensure JWT_SECRET is defined
    if (!process.env.JWT_SECRET) {
        return NextResponse.json({ error: 'JWT_SECRET is not defined' }, { status: 500 });
    }

    // Generate JWT token
    const token = jwt.sign({ userID: user._id, type: 'user' }, process.env.JWT_SECRET, {
        expiresIn: '100m',
    });

    return NextResponse.json({ token: token });
}
