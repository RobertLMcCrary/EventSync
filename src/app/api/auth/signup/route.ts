// TODO: Implement API routes for singup - POST (create)
// Same as POST to user, but also changes session data
// Import 'dotenv' at the top of your file
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import {NextRequest, NextResponse} from "next/server";
import jwt from 'jsonwebtoken';
import {createUser} from "@/db/create/user";
import {getUser} from "@/db/read/user";
import {User} from "@/types";
import hashPassword from "@/app/api/utils/hashPassword";
import {db} from "@/db/connect";
import {updateMeetup} from "@/db/update/meetup";

export async function POST(request: NextRequest) {
    let {email, username, password} = await request.json();


    const user = await getUser({email});

    if (user) {
<<<<<<< HEAD
        // return NextResponse.json({"error": 'Email already exists'});
=======
        return NextResponse.json({error: 'Email already exists'}, {status: 400});
>>>>>>> 14ea82b7aa3d6abf5e7b044a052844e432a82d04
    }
    const user2 = await getUser({username});

    if (user2) {
<<<<<<< HEAD
        // return NextResponse.json({"error": 'Username already exists'});
=======
        return NextResponse.json({error: 'Username already exists'}, {status: 400});
>>>>>>> 14ea82b7aa3d6abf5e7b044a052844e432a82d04
    }

    password = await hashPassword(password);
    const newUser = new User({email, username, password});

    // TODO: Find all meetups where the user is invited and create notifications

    const meetupCollection = db.collection('meetups');
    const meetups = await meetupCollection.find({invited: email}).toArray();

    for (const meetup of meetups) {
        // TODO: Create notification
        await updateMeetup(meetup._id, {$pull: {invited: email}});
        await updateMeetup(meetup._id, {$push: {invited: newUser._id}});
    }

    await createUser(newUser);

    // Ensure JWT_SECRET is defined
    if (!process.env.JWT_SECRET) {
        return NextResponse.json({ error: 'JWT_SECRET is not defined' }, { status: 500 });
    }
    // Token can be either user or API token
    // User token gives access to user data
    // API token gives access to API routes (with scopes) - not implemented
    const token = jwt.sign({ userID: newUser._id, type: 'user' }, process.env.JWT_SECRET, {
        expiresIn: '100m',
    });
    return NextResponse.json({ token: token, id: newUser._id });
}