import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { jwtVerify } from "jose";

const secret =  process.env.JWT_SECRET || "jwtsecret";

export async function middleware(req: NextRequest) {
    const unauthenticatedRoutes = ["/api/sign-up", "/api/sign-in", "/api/verify-code" , "/","/api/health"];
    const { pathname } = req.nextUrl;

    if (unauthenticatedRoutes.includes(pathname)) {
        return NextResponse.next();
    }
    const headersList = (await headers()).get("authorization");
    if (!headersList || !headersList.startsWith("Bearer ")) {
        return NextResponse.json(
            { success: false, message: "Authorization token required." },
            { status: 401 }
        );
    }
    const tokenArr:any = headersList?.split(" ");
    const token = tokenArr[1];
    console.log(token);
 
    
    if (!token) {
        return NextResponse.json(
            { success: false, message: "Authorization token required." },
            { status: 401 }
        );
    }

    try {
        // Verify the token
        const { payload }:any = await jwtVerify(token, new TextEncoder().encode(secret));
        const modifiedReq = req.clone();
        modifiedReq.headers.set("x-user-id", payload.userId.toString());
        return NextResponse.next(modifiedReq);
    } catch (error:any) {
        return NextResponse.json(
            { success: false, message: error.message || "Invalid or expired token." },
            { status: 401 }
        );
    }
}

export const config = {
    matcher: '/api/(.*)', // Matches API routes
};