import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { Message } from "@/model/User.model";

export async function POST(request: Request) {
    await dbConnect();

    const { username, content } =await request.json()
    try {
        const user = await UserModel.findOneAndUpdate({username})
        if (!user) {
            return Response.json({ success: false, message: "user not found" }, { status: 404 })
        }

        //is user accepting messages
        if (!user.isAcceptingMessage) {
            return Response.json({ success: false, message: "user not accepting messages" }, { status: 403 })
        }

        const newMessage = {content, createdAt: new Date()}
        user.message.push(newMessage as Message)
        await user.save()

        return Response.json({ success: true, message: "message sent successfully" }, { status: 200 })
    } catch (error) {
        console.log("failed to send message", error)
        return Response.json({ success: false, message: "Error sending message" }, { status: 500 })
    }
}