import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import {NextRequest, NextResponse} from "next/server";
import { createMeetup } from "@/db/create/meetup";
import { createNotification } from "@/db/create/notification";
import { updateUser } from "@/db/update/user";
import { getUser } from "@/db/read/user";
import {AppNotification, Meetup, User} from "@/types";
import {headers} from "next/headers";
import verifyJWT from "@/app/api/utils/verifyJWT";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
    const headersInstance = headers();
    const authorization = headersInstance.get('authorization');
    const data = verifyJWT(authorization);

    if ("error" in data) {
        return NextResponse.json({error: data.error})
    }
    if (data.type == "api"){
        // Do additional checks for scopes
    }

    const meetupData = await request.json(); // Get user data from request body
    meetupData.date = new Date(meetupData.date);
    const meetup = new Meetup(meetupData); // Create new user object from data
    const updatedInvited = meetup.invited.copyWithin(0, meetup.invited.length);
    meetup.invited.map(async (attendee: string) => {
        console.log(attendee);
        if (attendee.includes('@')) {
            const user = await getUser({email: attendee});
            if (!user) {
                if (!process.env.JWT_SECRET) {
                    // This should never happen
                    throw new Error('JWT_SECRET is not defined');
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
                let index = updatedInvited.indexOf(attendee);
                if (index !== -1) {
                    updatedInvited.splice(index, 1);
                }
                updatedInvited.push(user._id);
                await notifyUser(meetup, user)
            }
        } else {
            const user = await getUser({userID: attendee});
            await notifyUser(meetup, user)
        }
    });
    meetup.invited = updatedInvited;
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