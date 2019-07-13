var nodeMailer = require("nodemailer");
var mailer = {};


mailer.sendMail = function mail(email, msg, sbj) {
    let transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'auca.user.blackboard@gmail.com',
            pass: 'black123123'
        },
        tls: {
          rejectUnauthorized: false
      }
    });
    let mailOptions = {
        from: 'BlackBoard', // sender address
        to: email, // list of receivers
        subject: sbj, // Subject line
        text: 'hello dear,',// plain text body
        html: msg,// html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return false;
        } else {
            console.log('Message %s sent: %s', info.messageId, info.response);
            return true;
        }
    });
}

module.exports = mailer;