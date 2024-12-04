import { NextResponse } from "next/server";


export async function  GET() {
    return NextResponse.json({
        message:"Everything is good here"
    },{status:200});
}