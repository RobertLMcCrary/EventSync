import {NextRequest, NextResponse} from "next/server";
import { getNotification } from "@/db/read/notification";
import { updateNotification } from "@/db/update/notification";

import protectedRoute from "@/app/api/utils/protected";
import {headers} from "next/headers";

export async function GET(request: NextRequest, { params } : {params: {id: string}}) {
    const headersInstance = headers();
    const isAuthorized = protectedRoute(headersInstance);
    if (isAuthorized.status !== 200) {
        return isAuthorized;
    }

    const notificationObj = await getNotification(params.id); // Get user data by ID (user param is the user's ID)

    if (!notificationObj) {
        return NextResponse.json({error: 'Notification not found'}, {status: 404});
    }

    return NextResponse.json(notificationObj.toJSON()); // Return user data as JSON
}

export async function PUT(request: NextRequest, { params } : {params: {id: string}}) {
    const headersInstance = headers();
    const isAuthorized = protectedRoute(headersInstance);
    if (isAuthorized.status !== 200) {
        return isAuthorized;
    }

    // TODO: Implement updateNotification
    await updateNotification(params.id, request.body);
    return NextResponse.json({success: true});
}

export async function DELETE(request: NextRequest, { params } : {params: {meetup: string}}) {
    const headersInstance = headers();
    const isAuthorized = protectedRoute(headersInstance);
    if (isAuthorized.status !== 200) {
        return isAuthorized;
    }

    // TODO: Implement deleteNotification
}