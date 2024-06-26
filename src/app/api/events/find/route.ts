import {NextRequest, NextResponse} from "next/server";
import { createUser } from "@/db/create/user";
import { User } from "@/types";
import protectedRoute from "@/app/api/utils/protected";
import {headers} from "next/headers";
import {getUpcomingEvents} from "@/app/api/utils/eventFinder";

export async function POST(request: NextRequest) {
    const headersInstance = headers();
    const isAuthorized = protectedRoute(headersInstance);
    if (isAuthorized.status !== 200) {
        return isAuthorized;
    }

    const data = await request.json(); // Get user data from request body

    const events = await getUpcomingEvents(data.lat, data.lon, data.interests)
    return NextResponse.json(events);
}