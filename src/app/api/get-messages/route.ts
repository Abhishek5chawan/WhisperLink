import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import mongoose from "mongoose";
import userModel from "@/model/User.model";

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);

    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "not authenticated",
            },
            { status: 401 }
        );
    }

    // since we are writting aggregation pipeline
    const userId = new mongoose.Types.ObjectId(user._id);
    // console.log("user id hai -> ", userId);

    try {
        const user = await userModel
            .aggregate([
                { $match: { _id: userId } },
                {
                    $unwind: {
                        path: "$message",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $sort: { "message.createdAt": -1 },
                },
                { $group: { _id: "$_id", message: { $push: "$message" } } },
            ])
            .exec();

        // console.log("user data -> ", user);

        if (!user || user.length === 0) {
            return Response.json(
                {
                    success: false,
                    message: "user nahi found",
                },
                { status: 401 }
            );
        }

        return Response.json(
            {
                success: true,
                messages: user[0].message, // sending whole message array 
            },
            { status: 201 }
        );
    } catch (error) {
        console.log("An unexpected error occured", error);
        return Response.json(
            {
                success: false,
                message: "An unexpected error occured",
            },
            { status: 500 }
        );
    }
}