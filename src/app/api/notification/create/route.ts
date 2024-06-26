import {NextRequest, NextResponse} from "next/server";
import { createNotification } from "@/db/create/notification";
import { AppNotification } from "@/types";
import protectedRoute from "@/app/api/utils/protected";
import {headers} from "next/headers";

export async function POST(request: NextRequest) {
    const headersInstance = headers();
    const isAuthorized = protectedRoute(headersInstance);
    if (isAuthorized.status !== 200) {
        return isAuthorized;
    }

    const notificationData = await request.json(); // Get user data from request body
    const notificationObj = new AppNotification(notificationData); // Create new user object from data
    await createNotification(notificationObj); // Create user in database
    return NextResponse.json(notificationObj.toJSON()); // Return user data as JSON
}