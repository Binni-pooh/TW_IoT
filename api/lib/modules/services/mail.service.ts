const nodemailer = require("nodemailer");
import {config} from "../../config";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "binnytwink@gmail.com",
        pass: config.password, // не обычный пароль, а специальный "app password"
    },
});

export async function sendMail(to: string, subject: string, text: string) {
    const info = await transporter.sendMail({
        from: '"IoT" <binnytwink@gmail.com>',
        to: to,
        subject: subject,
        text: text,
    });

    console.log("Message sent:", info.messageId);

    return info;
}
