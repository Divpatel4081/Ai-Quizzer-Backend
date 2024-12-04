import {resend} from "@/lib/resend";
import VerificationEmail from "../../emails/VerificatioEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendverificationEmail(
    email:string,
    username:string,
    verifyCode:string,
):Promise<ApiResponse>{
    try{    
        await resend.emails.send({
            from: 'onboarding@project0x.org',
            to: email,
            subject: "Ai Quizzer | Verification Code",
            react: VerificationEmail({username , otp:verifyCode}),
          });
        return {success:true, message:"Verification Mail Send Succefully"};
    }   
    catch(emailError){
        console.error("error while sending verification mail",emailError);
        return {success:false , message:"failed to send verification mail"}
    }
}