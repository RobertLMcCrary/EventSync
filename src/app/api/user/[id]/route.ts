import {NextRequest, NextResponse} from "next/server";
import { getUser } from "@/db/read/user";
import { updateUser } from "@/db/update/user";
import { deleteUser } from "@/db/delete/user";
import {headers} from "next/headers";
import verifyJWT from "@/app/api/utils/verifyJWT";
import hashPassword from "@/app/api/utils/hashPassword";


export async function GET(request: NextRequest, { params } : {params: {id: string}}) {
    // Make sure request is authorized
    const headersInstance = headers()
    const authorization = headersInstance.get('authorization');
    const data = verifyJWT(authorization);

    if ("error" in data) {
        return NextResponse.json({error: data.error})
    }
    if (data.type == "api"){
        // Do additional checks for scopes
    }
    const user = await getUser({userID: params.id}); // Get user data by ID (user param is the user's ID)

    if (!user) {
        return NextResponse.json({error: 'User not found'});
    }

    return NextResponse.json(user.toJSON()); // Return user data as JSON
}

export async function PUT(request: NextRequest, { params } : {params: {id: string}}) {
 // Get user data by ID (user param is the user's ID)
    const headersInstance = headers();
    const authorization = headersInstance.get('authorization');
    const data = verifyJWT(authorization);

    if ("error" in data) {
        return NextResponse.json({error: data.error})
    }
    if (data.type == "api"){
        // Do additional checks for scopes
    }

    const updateData = await request.json(); // Get user data from request body

    if ('$set' in updateData['update']) {
        if ('password' in updateData['update']['$set']) {
            updateData['update']['$set']['password'] = await hashPassword(updateData['update']['$set']['password']);
        }
        if ('username' in updateData['update']['$set']) {
            const user = await getUser({username: updateData['update']['$set']['username']});
            if (user) {
                return NextResponse.json({error: 'Username already exists'});
            }
        }
        if ('email' in updateData['update']['$set']) {
            const user = await getUser({email: updateData['update']['$set']['email']});
            if (user) {
                return NextResponse.json({error: 'Email already exists'});
            }
        }
    }


    const user = await getUser({userID: params.id});

    if (!user) {
        return NextResponse.json({error: 'User not found'});
    }

    await updateUser(user._id, updateData); // Update user in database
    const updatedUser = await getUser({userID: params.id});

    if (!updatedUser) {
        return NextResponse.json({error: 'User not found'});
    }
    return NextResponse.json(updatedUser.toJSON()); // Return updated user data as JSON
}

export async function DELETE(request: NextRequest, { params } : {params: {id: string}}) {
    const headersInstance = headers();
    const authorization = headersInstance.get('authorization');
    const data = verifyJWT(authorization);

    if ("error" in data) {
        return NextResponse.json({error: data.error})
    }
    if (data.type == "api"){
        // Do additional checks for scopes
    }

    const user = await getUser({userID: params.id}); // Get user data by ID (user param is the user's ID)

    if (!user) {
        return NextResponse.json({error: 'User not found'});
    }

    await deleteUser(user._id); // Delete user from database

    return NextResponse.json({ status: "successful" }); // Return success message as JSON
}