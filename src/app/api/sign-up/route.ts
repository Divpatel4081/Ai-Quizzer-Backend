import { sendverificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";


export async function POST(req:Request){
    await dbConnect()

    try {
        const {username , email , password} = await req.json();
        //cheking username already taken or not
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified:true,
        })
        if(existingUserVerifiedByUsername){
            return NextResponse.json({
                success:false,
                message:"username is already taken",
            },{status:400})
        }

        //cheking if email already exist
        const existingUserByEmail = await UserModel.findOne({
            email
        });
        const verifyCode = Math.floor(100000 + Math.random()*900000).toString();

        if(existingUserByEmail){
            //do something
            //already verified
            if(existingUserByEmail.isVerified){
                return NextResponse.json({
                    success:false,
                    message:"user already exist",
                },{status:400})
            }
            //not verified
            else{
                const hashedPassword = await bcrypt.hash(password , 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 360000);
                await existingUserByEmail.save();
            }   
        }else{
            //first time so register in database
            const hashedPassword = await bcrypt.hash(password , 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode: verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified:false,
                isAcceptingMessage: true,
                message:[],
            })
            await newUser.save();
        }
        //send verification mail
        const emailResponse = await sendverificationEmail(email , username , verifyCode);
        //if mail not sent
        if(!emailResponse.success){
            return NextResponse.json({
                success:false,
                message:emailResponse.message
            },{
                status:500
            })
        }
        
        return NextResponse.json({
            success:true,
            message:"user registered succefully Please verify your email",
            email:emailResponse,
        },{status:200});

    } catch (error) {
        console.log("Error while registering user",error);
        return NextResponse.json({
            success:false,
            message:"Error while registering user"
        },
        {
            status:500,
        })
    }
}