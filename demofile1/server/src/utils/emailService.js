const nodemailer = require('nodemailer');
const axios = require('axios');

// Create a transporter for SMTP services
const createTransporter = async () => {
    // Check for Mailjet credentials
    if (process.env.MAILJET_API_KEY && process.env.MAILJET_SECRET_KEY) {
        console.log('Using Real Email Service (Mailjet)');
        return nodemailer.createTransport({
            host: 'in-v3.mailjet.com',
            port: 587,
            auth: {
                user: process.env.MAILJET_API_KEY,
                pass: process.env.MAILJET_SECRET_KEY
            }
        });
    }

    // Check if real email credentials are provided and not placeholders
    if (process.env.EMAIL_USER &&
        process.env.EMAIL_PASS &&
        process.env.EMAIL_USER !== 'your_email@gmail.com') {
        console.log('Using Real Email Service (Gmail)');
        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }

    // Fallback to Ethereal only if no real credentials
    console.log('Using Fake Email Service (Ethereal) - No credentials provided');
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });
};

const sendEmail = async (to, subject, text) => {
    try {
        // Check for EmailJS credentials first (highest priority)
        if (process.env.EMAILJS_SERVICE_ID &&
            process.env.EMAILJS_TEMPLATE_ID &&
            process.env.EMAILJS_PUBLIC_KEY &&
            process.env.EMAILJS_PRIVATE_KEY) {

            console.log('\n====================================================');
            console.log('📧  SENDING EMAIL VIA EMAILJS');
            console.log('----------------------------------------------------');
            console.log(`To:      ${to}`);
            console.log(`Subject: ${subject}`);

            try {
                // Extract verification code from text
                const codeMatch = text.match(/\d{6}/);
                const verificationCode = codeMatch ? codeMatch[0] : '';

                // Call EmailJS REST API directly
                const response = await axios.post('https://api.emailjs.com/api/v1.0/email/send', {
                    service_id: process.env.EMAILJS_SERVICE_ID,
                    template_id: process.env.EMAILJS_TEMPLATE_ID,
                    user_id: process.env.EMAILJS_PUBLIC_KEY,
                    accessToken: process.env.EMAILJS_PRIVATE_KEY,
                    template_params: {
                        to_email: to,
                        subject: subject,
                        message: text,
                        verification_code: verificationCode
                    }
                });

                console.log('Status:  SUCCESS ✓');
                console.log('====================================================\n');
                return response.data;
            } catch (emailjsError) {
                console.error('EmailJS Error:', emailjsError.response?.data || emailjsError.message);
                console.log('Falling back to SMTP...\n');
                // Fall through to SMTP methods below
            }
        }

        // Use SMTP services (Mailjet, Gmail, or Ethereal)
        const transporter = await createTransporter();

        let fromAddress = '"SocioSphere" <noreply@sociosphere.com>';
        if (process.env.MAILJET_SENDER_EMAIL) {
            fromAddress = `"SocioSphere" <${process.env.MAILJET_SENDER_EMAIL}>`;
        } else if (process.env.EMAIL_USER && process.env.EMAIL_USER !== 'your_email@gmail.com') {
            fromAddress = `"SocioSphere" <${process.env.EMAIL_USER}>`;
        }

        const info = await transporter.sendMail({
            from: fromAddress,
            to: to,
            subject: subject,
            text: text,
            html: `<b>${text}</b>`,
        });

        console.log('\n====================================================');
        console.log('📧  EMAIL SENT');
        console.log('----------------------------------------------------');
        console.log(`To:      ${to}`);
        console.log(`Subject: ${subject}`);
        const previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) {
            console.log(`Preview: ${previewUrl}`);
        }
        console.log('====================================================\n');
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        // Fallback: Log the code to console if email fails
        console.log(`[FALLBACK] Email to ${to}: ${subject} - ${text}`);
    }
};

module.exports = sendEmail;
