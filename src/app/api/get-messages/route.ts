import { getServerSession } from "next-auth"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User.model"
import { User } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/options"
import mongoose from "mongoose"

export async function GET() {
    try {
        await dbConnect()

        const session = await getServerSession(authOptions)
        if (!session || !session.user) {
            return new Response(JSON.stringify({ success: false, message: "not authenticated" }), { status: 401 })
        }

        const user: User = session.user as User

        // Check that user._id is defined and is a string or valid ObjectId
        if (!user._id) {
            return new Response(JSON.stringify({ success: false, message: "User ID is missing" }), { status: 400 })
        }

        // Convert user._id to ObjectId if it's a valid string format
        const userId = mongoose.Types.ObjectId.isValid(user._id) ? new mongoose.Types.ObjectId(user._id) : user._id

        const userMessages = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: "$messages" },
            { $sort: { "messages.createdAt": -1 } },
            { $group: { _id: "$_id", messages: { $push: "$messages" } } }
        ])

        if (!userMessages || userMessages.length === 0) {
            return new Response(JSON.stringify({ success: false, message: "user not found" }), { status: 404 })
        }

        return new Response(JSON.stringify({ success: true, messages: userMessages[0].messages }), { status: 200 })
    } catch (error) {
        console.error("Error in GET /api/get-messages:", error)
        return new Response(JSON.stringify({ success: false, message: "Error getting messages" }), { status: 500 })
    }
}
