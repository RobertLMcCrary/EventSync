// Verifies a JWT token and returns the decoded payload
// Used in protected API routes
import jwt, { JwtPayload } from "jsonwebtoken";

export default function verifyJWT(token: string | null) {
    if (!token) {
        return {error: "Unauthorized"}
    }

    if (!process.env.JWT_SECRET) {
        // this should never happen
        return {error: "Unauthorized"}
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload | string;
    if (!decoded || typeof decoded === 'string') {
        return {error: "Unauthorized"}
    } else if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
        return {error: "Expired Access Token"}
    } else {
        // If the token is valid, return the encoded data.
        return decoded
    }
}