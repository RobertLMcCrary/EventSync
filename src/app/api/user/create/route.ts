import {NextRequest, NextResponse} from "next/server";
import { createUser } from "@/db/create/user";
import { User } from "@/types";
import protectedRoute from "@/app/api/utils/protected";
import {headers} from "next/headers";

export async function POST(request: NextRequest) {
    const headersInstance = headers();
    const isAuthorized = protectedRoute(headersInstance);
    if (isAuthorized.status !== 200) {
        return isAuthorized;
    }

    const userData = await request.json(); // Get user data from request body
    const user = new User(userData); // Create new user object from data
    await createUser(user); // Create user in database
    return NextResponse.json(user.toJSON()); // Return user data as JSON
}