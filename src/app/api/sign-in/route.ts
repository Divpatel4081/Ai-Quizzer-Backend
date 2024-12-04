import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import {  NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "jwtsecret";

export async function POST(req: Request) {
    await dbConnect();

    try {
        const { email, password } = await req.json();

        // Find user by email
        const user = await UserModel.findOne({ email, isVerified: true });
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "Invalid email or user not verified.",
            }, { status: 401 });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({
                success: false,
                message: "Invalid credentials.",
            }, { status: 401 });
        }

        // Generate JWT token
        const secret = new TextEncoder().encode(JWT_SECRET);
        const token = await new SignJWT({ userId: (user._id as string).toString(), email: user.email })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("5h")
            .sign(secret);

        return NextResponse.json({
            success: true,
            message: "User signed in successfully.",
            token:token,
        }, { status: 200 });

    } catch (error) {
        console.log("Error during sign-in:", error);
        return NextResponse.json({
            success: false,
            message: "Error during sign-in.",
        }, { status: 500 });
    }
}
