import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import SubmissionModel from "@/model/Submission";
import { redis } from "@/lib/redis";

//function which fetch the all data & return it
const getFilteredSubmissions = async (filters: any,userId:any) => {
  
  try {
    const { grade, subject, minScore, maxScore, fromDate, toDate } = filters;
    //caching
    const cacheKey = `submissions:${userId}:${grade || "all"}:${subject || "all"}:${minScore || "min"}-${maxScore || "max"}:${fromDate || "start"}-${toDate || "end"}`;
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      console.log("Cache hit:", cacheKey);
      return cachedData;
    }

    const submissionData = [];
    if(minScore && maxScore){
      const submission = await SubmissionModel.find({
        userId: userId,
        score: { '$gte': minScore, '$lte': maxScore }
      });
      console.log("submissions are:",submission);
      submissionData.push(...submission);
    }

    if(subject){
      const submission = await SubmissionModel.find({
        userId: userId,
        subject:subject
      });
      console.log("submissions are:",submission);
      submissionData.push(...submission);
    }

    if(fromDate && toDate){
      const submission = await SubmissionModel.find({
        userId: userId,
        submittedAt: {
            '$gte': new Date(fromDate), 
            '$lte': new Date(toDate)    
        }
      });
      console.log("Submissions for date range:", submission);
      submissionData.push(...submission);
    }
    await redis.set(cacheKey, submissionData, {ex:3600});

    return submissionData;
  } catch (error:any) {
    throw new Error(error.message);
  }
};


export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    //fetching params
    const {searchParams} = new URL(req.url);
    console.log(searchParams);
    const grade = searchParams.get("grade");
    const subject = searchParams.get("subject");
    const minScore = searchParams.get("minScore");
    const maxScore = searchParams.get("maxScore");
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");
    // const { grade, subject, minScore, maxScore, fromDate, toDate } = await req.json();(if post request)


    const userId:any = req.headers.get("x-user-id");
    //fetching all submission of user
    const filters = {
        grade: grade ? parseInt(grade as string) : undefined,
        subject: subject ? (subject as string) : undefined,
        minScore: minScore ? parseInt(minScore as string) : undefined,
        maxScore: maxScore ? parseInt(maxScore as string) : undefined,
        fromDate: fromDate ? fromDate as string : undefined,
        toDate: toDate ? toDate as string : undefined,
      };
    console.log(filters);
    // Retrieve filtered submissions
    const submissions:any = await getFilteredSubmissions(filters,userId);
    
    if (submissions.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No submissions found for the given filters",
      }, { status: 404 });
    }    
    return NextResponse.json({
        message:"history fetched succefully",
        success:true,
        submissions
       },{status:200});

  } catch (error:any) {

    return NextResponse.json({
        success:false,
        message:error.message,  
    },{status:500});

  }
}



