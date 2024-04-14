const nodemailer = require("nodemailer");
require("dotenv").config();

const mailSender = async (email, title, body) => {
    try{
        let transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'uriel.huel29@ethereal.email',
        pass: 'e5Pxvhv2G6ReghXP3G'
    }
        });

        let info = await transporter.sendMail({
            from : 'StudyNotion || CodeVita - by Saqib',
            to : `${email}`,
            subject : `${title}`,
            html : `${body}`
        });

        // console.log("Mail Body", info);
        return info;
    }catch(error){
        console.log(error.message);
    }
}

module.exports = mailSender;