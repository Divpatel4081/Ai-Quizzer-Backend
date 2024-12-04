import dbConnect from "@/lib/dbConnect";
import { redis } from "@/lib/redis";
import QuizModel from "@/model/Quiz";
import SubmissionModel from "@/model/Submission";

import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    await dbConnect();
    try {
      const userId = req.headers.get("x-user-id");
      const { quizId, responses} = await req.json();

      //cache key if same user try to calculate score for same quiz
      const cacheKey = `quiz_submission:${quizId}:${userId}`;
      const cachedResult = await redis.get(cacheKey);
      if (cachedResult) {
        const {score , evaluatedResponses}:any = cachedResult;
        return NextResponse.json({
          message: "Quiz result fetched from cache",
          success: true,
          score,
          evaluatedResponses,
        }, { status: 200 });
      }

      const quiz = await QuizModel.findById(quizId);
      if (!quiz) {
        return NextResponse.json({
            message:"quiz not found in database",
        },{status:404});
      }
      
      let score = 0;
      const evaluatedResponses = responses.map((response:any) => {
        const question = quiz.questions.find((q) => q._id.equals(response.questionId));
        const isCorrect = question && question.correctAnswer === response.userResponse;
        console.log("is correct",isCorrect);
        if (isCorrect) score += quiz.maxScore / quiz.totalQuestions;
        return { ...response, isCorrect };
      });
  
      const submission = await SubmissionModel.create({
        quizId,
        userId:userId,
        responses: evaluatedResponses,
        score,
        subject:quiz.subject,
        submittedAt: new Date(),
        retried: false,
      });

      await redis.set(cacheKey, { score, evaluatedResponses }, { ex: 3600 });

      return NextResponse.json({
        message:"quiz submitted succefully",
        success:true,
        score,
        submission
       },{status:200});



    } catch (error:any) {
        return NextResponse.json({
            message:  error.message ||  "not able to submit quiz",
            success:false,
        },{status:500});
    }
  }