import verifyJWT from "@/app/api/utils/verifyJWT";
import {NextResponse} from "next/server";

export default function protectedRoute(headersInstance: any){
    const authorization = headersInstance.get('authorization');

    if (!authorization) {
        return NextResponse.json({ error: 'Not Authorized' }, { status: 401 })
    }

    const token = authorization.split(' ')[1];

    if (!token) {
        return NextResponse.json({ error: 'Not Authorized' }, { status: 401 });
    }

    let data;
    try {
        data = verifyJWT(token);
    } catch (e) {
        return NextResponse.json({ error: 'Not Authorized' }, { status: 401 });
    }

    if ("error" in data) {
        return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
    }
    if (data.type == "api"){
        // Do additional checks for scopes
    }

    return NextResponse.json(data);
}