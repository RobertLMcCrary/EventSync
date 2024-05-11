import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import {NextRequest, NextResponse} from "next/server";
import { createMeetup } from "@/db/create/meetup";
import { createNotification } from "@/db/create/notification";
import { getUser } from "@/db/read/user";
import {AppNotification, Meetup, User} from "@/types";
import jwt from "jsonwebtoken";
import protectedRoute from "@/app/api/utils/protected";
import {headers} from "next/headers";

export async function POST(request: NextRequest) {
    const headersInstance = headers();
    const isAuthorized = protectedRoute(headersInstance);
    if (isAuthorized.status !== 200) {
        return isAuthorized;
    }

    const meetupData = await request.json(); // Get user data from request body
    meetupData.date = new Date(meetupData.date);
    const meetup = new Meetup(meetupData); // Create new user object from data

    await Promise.all(meetup.invited.map(async (attendee: string) => {
        if (attendee.includes('@')) {
            const user = await getUser({email: attendee});
            if (!user) {
                if (!process.env.JWT_SECRET) {
                    // This should never happen
                    return NextResponse.json({ error: 'JWT_SECRET is not defined' }, { status: 500 });
                }
                const expiresIn = (meetup.date.getTime() - new Date().getTime()) / 1000 / 60; // Invitation expires when the meetup starts
                const token = jwt.sign({ userID: attendee, meetup: meetup._id, type: 'meetup-invitation' }, process.env.JWT_SECRET, {
                    expiresIn: `${expiresIn}m`,
                });
                // Send email with link: /signup?meetupInvite=token
                await fetch(process.env.NEXT_PUBLIC_MAIL_URL + '/send-meetup-invite', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({email: attendee, inviteLink: `https://beta.eventsync.app/signup?meetupInvite=${token}`, meetupName: meetup.title}),
                });

            } else {

                let index = meetup.invited.indexOf(attendee);

                if (index !== -1) {
                    meetup.invited[index] = user._id
                    console.log(meetup.invited);
                }
                await notifyUser(meetup, user)
            }
        } else {
            const user = await getUser({userID: attendee});
            await notifyUser(meetup, user)
        }
    }));

    await createMeetup(meetup); // Create meetup in database
    return NextResponse.json(meetup.toJSON()); // Return meetup data as JSON
}

async function notifyUser(meetup: Meetup, attendee: User | null) {
    if (!attendee) {
        return;
    }
    if (!process.env.JWT_SECRET) {
        // This should never happen
        throw new Error('JWT_SECRET is not defined');
    }
    const expiresIn = (meetup.date.getTime() - new Date().getTime()) / 1000 / 60; // Invitation expires when the meetup starts
    const token = jwt.sign({ userID: attendee._id, meetup: meetup._id, type: 'meetup-invitation' }, process.env.JWT_SECRET, {
        expiresIn: `${expiresIn}m`,
    });
    // Create notification
    const notification = new AppNotification({
        initiator: meetup.creator,
        receiver: attendee._id,
        meetup: meetup._id,
        buttonHREF: '/meetups/invite/' + token,
        type: 1
    });

    await fetch(process.env.NEXT_PUBLIC_MAIL_URL + '/send-meetup-invite', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email: attendee.email, inviteLink: `https://beta.eventsync.app/meetups/invite/${token}`, meetupName: meetup.title}),
    });

    await createNotification(notification);
}