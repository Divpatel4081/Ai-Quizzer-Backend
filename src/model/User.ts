import mongoose , {Schema , Document} from "mongoose"


//interfadce for user schema
export interface Users extends Document{
    username:string,
    name:string,
    email:string,
    password: string,
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified:boolean,
}

//user schema
const UsersSchema:Schema<Users> = new Schema({
    username:{
        type:String,
        required:[true , "Username is required"],
        trim:true,
        unique:true,
    },
    email:{
        type:String,
        required:[true, "Email is required"],
        unique:true,
        match:[/.+\@.+\..+/ , 'Please use a Valid email address']
    },
    password:{
        type:String,
        required:[true, "Password is required"],
    },
    verifyCode:{
        type:String,
        required:[true, "verifyCode is required"],
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true, "verifyCodeExpiry is required"],
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
})

const UserModel = (mongoose.models.User as mongoose.Model<Users>) || mongoose.model<Users>("User",UsersSchema);
export default UserModel;


