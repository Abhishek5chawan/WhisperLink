import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmails(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: 'Mystery Message | verification code',
            react: VerificationEmail({
                username,
                otp: verifyCode
            })
        })
        return {
            success: true,
            message: "verification email send successfully"
        }
    } catch (emailError) {
        console.error("error sending verification email: ", emailError);
        return {
            success: false,
            message: "Error sending verification email"
        }
    }
}