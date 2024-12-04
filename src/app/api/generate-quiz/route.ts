import dbConnect from "@/lib/dbConnect";
import QuizModel from "@/model/Quiz";
import { generateQuestions } from "@/helpers/generateQuestions";
import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function POST(req: Request) {
  await dbConnect();
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({
          success: false,
          message: "User ID not found.",
      }, { status: 400 });
    }

    const { grade, subject, totalQuestions, maxScore, difficulty } = await req.json();


    //using redis if grade subject & difficulty are same
    const cacheKey = `quiz:${grade}:${subject}:${difficulty}:${totalQuestions}`;
    const cachedQuestions = await redis.get(cacheKey);
    let jsonQuestions;

    if(cachedQuestions){
      jsonQuestions = cachedQuestions;
      return NextResponse.json({
        message: "data fetched from cache memory",
        success: true,
        questions: jsonQuestions,
      }, { status: 200 });
    }else{
      const questions = await generateQuestions(grade, subject, totalQuestions, difficulty);
      const betterLookingQuestion = questions.replace(/```json|```/g, '').trim();
      jsonQuestions = JSON.parse(betterLookingQuestion);
      await redis.set(cacheKey,jsonQuestions , {ex:60});
    }
    
    console.log(jsonQuestions);
    const quiz = await QuizModel.create({
      grade,
      subject,
      totalQuestions,
      maxScore,
      difficulty,
      questions:jsonQuestions,
      createdBy: userId,
    });
    
    const questions =  quiz.questions.map(q => ({
      id: q._id.toString(), // Include question ID as `id`
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer
    }))

    return NextResponse.json({
      message: "data fetched succefully from the openai",
      success: true,
      questions: questions,
      quizId:quiz._id,
    }, { status: 200 });
    
  } 
  catch (error:any) {
    return NextResponse.json({
      message: error.message || "may-be openai fault or database storage problem in Quiz schema",
      success: false,
    }, { status: 500 });
  }
}
