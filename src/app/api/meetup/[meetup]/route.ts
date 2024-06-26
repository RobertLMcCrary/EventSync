import {NextRequest, NextResponse} from "next/server";
import { getMeetup } from "@/db/read/meetup";
import { updateMeetup } from "@/db/update/meetup";
import { deleteMeetup } from "@/db/delete/meetup";
import protectedRoute from "@/app/api/utils/protected";
import {headers} from "next/headers";

export async function GET(request: NextRequest, { params } : {params: {meetup: string}}) {
    const headersInstance = headers();
    const isAuthorized = protectedRoute(headersInstance);
    if (isAuthorized.status !== 200) {
        return isAuthorized;
    }

    const meetupObj = await getMeetup(params.meetup); // Get user data by ID (user param is the user's ID)

    if (!meetupObj) {
        return NextResponse.json({error: 'Meetup not found'}, {status: 404});
    }

    return NextResponse.json(meetupObj.toJSON()); // Return user data as JSON
}

export async function PUT(request: NextRequest, { params } : {params: {meetup: string}}) {
    const headersInstance = headers();
    const isAuthorized = protectedRoute(headersInstance);
    if (isAuthorized.status !== 200) {
        return isAuthorized;
    }

    const updateData = await request.json(); // Get user data from request body
    const meetup = await getMeetup(params.meetup); // Get user data by ID (user param is the user's ID)

    if (!meetup) {
        return NextResponse.json({error: 'Meetup not found'}, {status: 404});
    }

    await updateMeetup(meetup._id, updateData); // Update user in database
    const updatedMeetup = await getMeetup(params.meetup);

    if (!updatedMeetup) {
        return NextResponse.json({error: 'Meetup not found'}, {status: 404});
    }
    return NextResponse.json(updatedMeetup.toJSON()); // Return updated user data as JSON
}

export async function DELETE(request: NextRequest, { params } : {params: {meetup: string}}) {
    const headersInstance = headers();
    const isAuthorized = protectedRoute(headersInstance);
    if (isAuthorized.status !== 200) {
        return isAuthorized;
    }

    const meetup = await getMeetup(params.meetup); // Get user data by ID (user param is the user's ID)

    if (!meetup) {
        return NextResponse.json({error: 'Meetup not found'}, {status: 404});
    }

    await deleteMeetup(meetup._id); // Delete user from database

    return NextResponse.json({ status: "successful" }); // Return success message as JSON
}