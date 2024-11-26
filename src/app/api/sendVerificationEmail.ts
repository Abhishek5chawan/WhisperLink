import nodemailer from 'nodemailer';

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<{ success: boolean; message: string }> {
    try {
        const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS } = process.env;
        if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
            throw new Error('SMTP configuration is incomplete');
        }

        const transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: parseInt(SMTP_PORT),
            secure: SMTP_SECURE === 'true',
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASS,
            },
        });

        const mailOptions = {
            from: `"Mystery Message OTP" <${SMTP_USER}>`,
            to: email,
            subject: 'Your OTP to verify your account on Mystery Message',
            text: `Hello, Your OTP for the account ${username} is: ${verifyCode}. If you did not request this OTP, please ignore this email.`,
            html: `<p>Hello,</p><p>Your OTP for the account <strong>${username}</strong> is:</p><h2>${verifyCode}</h2><p>If you did not request this OTP, please ignore this email.</p>`,
        };

        await transporter.sendMail(mailOptions);

        return { success: true, message: 'Email sent successfully' };
    } catch (error: any) {
        console.error('Error sending email:', error.message || error);
        return { success: false, message: 'Failed to send email' };
    }
}
