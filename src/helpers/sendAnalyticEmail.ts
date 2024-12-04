import {resend} from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import StaticsEmail from "../../emails/StasticsEmail";

export async function sendAnalyticsEmail(
    text:string,
    email:string,
):Promise<ApiResponse>{
    try{    
        await resend.emails.send({
            from: 'onboarding@project0x.org',
            to: email,
            subject: "Ai Quizzer | Stastics Analysis",
            react: StaticsEmail({text}),
          });
        return {success:true, message:"Report Send Succefully"};
    }   
    catch(emailError){
        console.error("error while sending Report mail",emailError);
        return {success:false , message:"failed to send Report mail"}
    }
}