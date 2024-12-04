import dbConnect from "@/lib/dbConnect";
import QuizModel from "@/model/Quiz";
import { NextRequest, NextResponse } from "next/server";
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';import { redis } from "@/lib/redis";
;
export const maxDuration = 30;

//give hint of answer
export async function GET(req:NextRequest , {params}:any){
    await dbConnect();
    try {
        const {quizId,questionId} = await params;
        
        if(!quizId || !questionId ){
            return NextResponse.json({
                message:"quizId & questionId both required",
                success:false,
            },{status:501});
        }

        const quiz = await QuizModel.findById(quizId);
        if(!quiz){
            return NextResponse.json({
                message:"there is some error in fetching the quiz",
                success:false,
            },{status:501});
        }

        const question = quiz.questions.find((q) => q._id.toString() === questionId);
        if(!question){
            return NextResponse.json({
                message:"question didn't find in DB",
                success:false,
            },{status:501});
        }

        const cacheKey = `quiz_hint:${quizId}:${questionId}`;
        const cachedHint = await redis.get(cacheKey);        
        if (cachedHint) {
            return NextResponse.json({
                message: "Fetched hint from cache",
                success: true,
                hint: cachedHint,
            }, { status: 200 });
        }

        const prompt = `Provide a helpful hint for this question: "${question.questionText}". Ensure the hint is concise and clear.`;

        const { text } = await generateText({
            model: openai('gpt-4o-mini'),
            maxTokens: 400,
            prompt,
        });

        await redis.set(cacheKey, text, { ex: 1800 });

        return NextResponse.json({
            message:"got hint from openAi",
            success:true,
            hint:text,
        },{status:200});



    } catch (error:any) {
        return NextResponse.json({
            message:error.message || "didn't get the hint",
            success:false,
        },{status:500});
    }
}