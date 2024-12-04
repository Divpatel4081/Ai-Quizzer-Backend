import dbConnect from "@/lib/dbConnect";
import SubmissionModel from "@/model/Submission";
import { NextRequest, NextResponse } from "next/server";
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { sendAnalyticsEmail } from "@/helpers/sendAnalyticEmail";
import UserModel from "@/model/User";
import { redis } from "@/lib/redis";
;
export const maxDuration = 30;

export async function POST(req:NextRequest,{params}:any) {
    await dbConnect();
    try {
        const {quizId} = await params;
        const submission = await SubmissionModel.findOne({quizId});
        if(!submission){
            return NextResponse.json({
                success:false,
                message:"there is no submission so we can't genearate the email",
            },{status:500});
        }

        const userId = submission.userId;
        const user = await UserModel.findById(userId);
        if(!user){
            return NextResponse.json({
                success:false,
                message:"user not found",
            },{status:500});
        }


        const cacheKey = `quiz_analysis:${quizId}:${userId}`;
        const cachedAnalysis = await redis.get(cacheKey);
        if (cachedAnalysis) {
            const text:any = cachedAnalysis;
            // console.log(cachedAnalysis);
            // console.log("text is:",text);
            await sendAnalyticsEmail(text,user.email);
            return NextResponse.json({
                success:true,
                message:"anlytical mail send succefully using caching",
            },{status:200});
        }
        
        const responses = submission.responses;
        const prompt = `Analyze the following quiz responses and suggest two skills for improvement:
        Responses: ${JSON.stringify(responses)} , give responses point wise so output looks good add <br> tag at neccessary point & when new point(number) comes add br tag before this point`;
        const { text } = await generateText({
            model: openai('gpt-4o-mini'),
            maxTokens: 400,
            prompt,
        });
        console.log("text is:",text);
        await redis.set(cacheKey, text, { ex: 1800 });
        await sendAnalyticsEmail(text,user.email);
        
        return NextResponse.json({
            success:true,
            message:"anlytical mail send succefully",
        },{status:200});
        
    } catch (error:any) {
        return NextResponse.json({
            success:false,
            message:error.message || "error in generatiog email"
        },{status:500});
    }
}