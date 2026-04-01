const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOTP = async (email, otp) => {
    try {
        const { data, error } = await resend.emails.send({
            from: process.env.EMAIL_FROM,
            to: [email],
            subject: 'Zorvyn Finance: Verification Code',
            html: `
                <div style="font-family: sans-serif; padding: 20px; color: #0F172A;">
                    <h2 style="color: #10B981;">Your Verification Code</h2>
                    <p>Enter the following code to verify your account:</p>
                    <div style="font-family: monospace; font-size: 32px; font-weight: bold; background: #f1f5f9; padding: 15px; border-radius: 5px; text-align: center; letter-spacing: 5px;">
                        ${otp}
                    </div>
                    <p style="font-size: 12px; color: #64748b; margin-top: 20px;">This code expires in 10 minutes.</p>
                </div>
            `,
        });

        if (error) {
            console.error('Resend Error:', error);
            throw new Error(error.message);
        }
        return data;
    } catch (err) {
        console.error('Email Service Error:', err);
        throw err;
    }
};

module.exports = { sendOTP };
