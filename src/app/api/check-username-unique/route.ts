import dbconnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import {z} from "zod"
import {usernameValidation} from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {
    //console.log(request.method)
    await dbconnect()

    try {
        const {searchParams} = new URL(request.url)
        const queryParam = {
            username: searchParams.get("username")
        }

        //validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam)
        console.log(result)
        if(!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({ success: false, message: "Invalid username", usernameErrors }, { status: 400 })
        }

        const {username} = result.data

        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true })

        if (existingVerifiedUser) {
            return Response.json({ success: false, message: "Username already exists" }, { status: 400 })
        }

        return Response.json({ success: true, message: "Username available and unique" }, { status: 200 })
    } catch (error) {
        console.error("error checking username unique: ", error);
        return Response.json({ success: false, message: "Error checking username unique" }, { status: 500 })
    }
}