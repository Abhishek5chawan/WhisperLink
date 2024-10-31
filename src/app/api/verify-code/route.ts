import dbconnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";

export async function POST(request: Request) {
    await dbconnect();

    try {
        const {username, code} = await request.json();

        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({username: decodedUsername});

        if(!user) {
            return Response.json({ success: false, message: "User not found" }, { status: 400 });
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeExpired = new Date(user.verifyCodeExpiry) > new Date();

        if(isCodeValid && isCodeExpired) {
            user.isVerified = true;
            await user.save();
            return Response.json({ success: true, message: "user verified successfully" }, { status: 200 }); 
        } else if(!isCodeExpired) {
            return Response.json({ success: false, message: "Code expired please sign up again" }, { status: 400 });
        } else {
            return Response.json({ success: false, message: "Invalid code" }, { status: 400 });
        }
    } catch (error) {
        console.error("error verifying code: ", error);
        return Response.json({ success: false, message: "Error verifying code" }, { status: 500 });
    }
}
