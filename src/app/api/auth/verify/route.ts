import { NextRequest } from 'next/server'
import protectedRoute from "@/app/api/utils/protected";
import {headers} from "next/headers";

export async function GET(request: NextRequest) {
    const headersInstance = headers();
    return protectedRoute(headersInstance);
}
