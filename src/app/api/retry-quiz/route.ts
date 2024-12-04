import dbConnect from "@/lib/dbConnect";
import QuizModel from "@/model/Quiz";
import SubmissionModel from "@/model/Submission";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";


const calculateScore = async (quizId:mongoose.Types.ObjectId , responses:any[]) => {
    try {
        const quiz = await QuizModel.findById(quizId);
        if(!quiz){
            throw new Error("quiz not found");
        }
        let score = 0;
        const evaluatedResponses = responses.map((response:any) => {
            const question = quiz.questions.find((q) => q._id.equals(response.questionId));
            const isCorrect = question && question.correctAnswer === response.userResponse;
            if (isCorrect) score += quiz.maxScore / quiz.totalQuestions;
            return { ...response, isCorrect };
        });
        console.log(score);
        return {evaluatedResponses,score};
    } catch (error) {
        console.log(error);
        throw new Error("error in calculate score");
    }


}

export async function POST(req:NextRequest){
    await dbConnect();
    try {
        const {quizId ,responses} = await req.json();
        
        const {evaluatedResponses , score} = await calculateScore(quizId,responses);
        const newSubmission = await SubmissionModel.findOneAndUpdate({quizId},{
            score,
            responses:evaluatedResponses,
            updatedAt:new Date(),
        })
        console.log(newSubmission);

        if(newSubmission){
            console.log("updated succefully submission schmea");
        }
        return NextResponse.json({
            success:true,
            message:"success submission updated succefully"
        },{status:200});
    } catch (error:any) {
        return NextResponse.json({
            success:false,
            message:error.message || "error in retry quiz"
        },{status:500});
    }
}