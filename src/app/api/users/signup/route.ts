import { userValidationSchema } from './../../../../modules/users/user.validation';
import { User } from './../../../../modules/users/user.model';
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import connectDB from "@/config/db";
import bcryptjs from "bcryptjs"

// import { sendEmail } from '@/helpers/mailer';
import { UserServices } from '@/modules/users/user.service';
connectDB();
export async function POST(req: NextRequest) {
    
  try {
    const reqData = await req.json();
    const { userName, email, password } = reqData;

    
    const user = await User.findOne({email});
    if (user ){
        return NextResponse.json({
            message: "User already exists"
        }, {status: 400})
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);


    
    // goto user services for post
    const newUser = {userName, email, password: hashedPassword};
    const validatedUser = userValidationSchema.parse(newUser);
    const result = await UserServices.createNewUser(validatedUser)
   


    //   send verification mail
      // const mailResponse = await sendEmail({email, emailType: "VERIFY", userId: (result as any)._id });
    

    return NextResponse.json(
        {
          success: true,
          message: "User registered Successfully",
          data: result,
        },
        { status: 200 }
      );

  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "User sign up failed",
        error: error,
      },
      { status: 500 }
    );
  }
}
