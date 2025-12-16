import nodemailer from "nodemailer";

export const sendEmail = async(options) => {
    // Create a test account or replace with real credentials.
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        service: process.env.SMTP_SERVICE,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_MAIL,
            // to generate this password got to email setting > security - the 2-step verifaction hase be completed before this password generation
            //goto the settin home and type app password and click app password and write your email password
            // create new app name and generate a app password
            pass: process.env.SMTP_PASSWORD,
        },
    });

    const mailoptions = {
        from: process.env.SMTP_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message
    }
    await transporter.sendMail(mailoptions);
}