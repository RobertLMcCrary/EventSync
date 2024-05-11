import {getUser} from "@/db/read/user";
import {NextRequest, NextResponse} from "next/server";
import protectedRoute from "@/app/api/utils/protected";
import {headers} from "next/headers";

export async function POST(request: NextRequest) {
 // TODO: Implement CSRF protection @gam3rr
    const headersInstance = headers();
    const isAuthorized = protectedRoute(headersInstance);
    if (isAuthorized.status !== 200) {
        return isAuthorized;
    }
    // Get user data from request body
    const data = await request.json();
    // Get user data by email
    const user = await getUser(data);
    // Check if user exists
    if (!user) {
        return NextResponse.json({error: 'User not found'}, {status: 404});
    }
    // Return user data as JSON
    return NextResponse.json(user.toJSON());
}