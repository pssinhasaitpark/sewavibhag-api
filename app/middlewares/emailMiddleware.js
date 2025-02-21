// emailMiddleware.js
const nodemailer = require('nodemailer');

const sendWelcomeEmail = async (userDetails) => {
    const { user_name, full_name, email, mobile, user_type, password, level } = userDetails;

    // Create a transporter for sending the email
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Use other services like SendGrid, Mailgun, etc. if necessary
        auth: {
            user: `${process.env.EMAIL_USER}`,
            pass: `${process.env.EMAIL_PASS}`,
        },
    });

    const mailOptions = {
        from: `${process.env.EMAIL_USER}`,
        to: email,
        subject: 'Your Sewavibhag Account Has Been Created',
        html: `
         <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; background-color: #f7f7f7; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <h2 style="background: linear-gradient(to right, #ff6600, #ff9900); color: transparent; -webkit-background-clip: text; text-align: center;">Welcome, ${full_name}!</h2>
                <p style="font-size: 16px;">Your account has been successfully created. Here are your details:</p>
                <ul style="font-size: 16px; list-style-type: none; padding-left: 0;">
                    <li><strong>Username:</strong> ${user_name}</li>
                    <li><strong>Email:</strong> <a href="mailto:${email}" style="color: #ff6600;">${email}</a></li>
                    <li><strong>Mobile:</strong> <a href="tel:${mobile}" style="color: #ff6600;">${mobile}</a></li>
                    <li><strong>Password:</strong> ${password}</li>
                    <li><strong>User Type:</strong> ${user_type}</li>
                    <li><strong>Level:</strong> ${level}</li>
                </ul>
                <p style="font-size: 16px;">To access your account, please visit our <a href="https://sewavibhage.netlify.app/" style="color: #ff6600;">website</a> and log in using your credentials.</p>
                <p style="font-size: 16px; font-weight: bold; color: #ff6600;">Please do not share your password with anyone.</p>
                <p style="font-size: 16px;">If you did not request this account, please contact our support team immediately.</p>
                <p style="font-size: 16px; color: #777;">Best Regards</p>
            </div>
        `,
    };


    // Send the email
    return transporter.sendMail(mailOptions);
};

// Middleware to send email
const emailMiddleware = async (req, res, next) => {
    try {
        const userDetails = req.userDetails; // Assuming user details are stored in req.userDetails

        // Send the email asynchronously
        await sendWelcomeEmail(userDetails);

    } catch (error) {
        console.log('Error sending welcome email:', error);
        return res.status(500).json({ message: 'Error sending welcome email.' });
    }
};

module.exports = emailMiddleware;
