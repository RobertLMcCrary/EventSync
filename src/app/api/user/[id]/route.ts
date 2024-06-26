import {NextRequest, NextResponse} from "next/server";
import { getUser } from "@/db/read/user";
import { updateUser } from "@/db/update/user";
import { deleteUser } from "@/db/delete/user";
import hashPassword from "@/app/api/utils/hashPassword";
import protectedRoute from "@/app/api/utils/protected";
import {headers} from "next/headers";


export async function GET(request: NextRequest, { params } : {params: {id: string}}) {
    const headersInstance = headers();
    const isAuthorized = protectedRoute(headersInstance);
    if (isAuthorized.status !== 200) {
        return isAuthorized;
    }

    const user = await getUser({userID: params.id}); // Get user data by ID (user param is the user's ID)

    if (!user) {
        return NextResponse.json({error: 'User not found'}, {status: 404});
    }

    return NextResponse.json(user.toJSON()); // Return user data as JSON
}

export async function PUT(request: NextRequest, { params } : {params: {id: string}}) {
    const headersInstance = headers();
    const isAuthorized = protectedRoute(headersInstance);
    if (isAuthorized.status !== 200) {
        return isAuthorized;
    }

    const updateData = await request.json(); // Get user data from request body

    if ('$set' in updateData['update']) {
        if ('password' in updateData['update']['$set']) {
            updateData['update']['$set']['password'] = await hashPassword(updateData['update']['$set']['password']);
        }
        if ('username' in updateData['update']['$set']) {
            const user = await getUser({username: updateData['update']['$set']['username']});
            if (user) {
                return NextResponse.json({error: 'Username already exists'}, {status: 400});
            }
        }
        if ('email' in updateData['update']['$set']) {
            const user = await getUser({email: updateData['update']['$set']['email']});
            if (user) {
                return NextResponse.json({error: 'Email already exists'}, {status: 400});
            }
        }
    }


    const user = await getUser({userID: params.id});

    if (!user) {
        return NextResponse.json({error: 'User not found'}, {status: 404});
    }

    await updateUser(user._id, updateData); // Update user in database
    const updatedUser = await getUser({userID: params.id});

    if (!updatedUser) {
        return NextResponse.json({error: 'User not found'}, {status: 404});
    }
    return NextResponse.json(updatedUser.toJSON()); // Return updated user data as JSON
}

export async function DELETE(request: NextRequest, { params } : {params: {id: string}}) {
    const headersInstance = headers();
    const isAuthorized = protectedRoute(headersInstance);
    if (isAuthorized.status !== 200) {
        return isAuthorized;
    }

    const user = await getUser({userID: params.id}); // Get user data by ID (user param is the user's ID)

    if (!user) {
        return NextResponse.json({error: 'User not found'}, {status: 404});
    }

    await deleteUser(user._id); // Delete user from database

    return NextResponse.json({ status: "successful" }); // Return success message as JSON
}