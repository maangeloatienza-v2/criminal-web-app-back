'use strict';

const nodemailer = require('nodemailer');
const Email = require('email-templates');
const path = require('path');

const emailDirectory  = path.join(__dirname, '/../views/email');

function setTransporter () {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: true,
        port: 25,
        auth: {
            // user: 'bookings@logistikus.com',
            // pass: 'cxpass2018'
            user: 'criminal.web.app@gmail.com',
            pass: 'secret_password123'
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    return transporter;
}

function sendMail (mail) {
    const email = new Email();

    return email
        .render(`${emailDirectory}/${mail.template}`, mail.data)
        .then(html => {
            return mail.transporter.sendMail({
                from:        mail.from || 'ThesIsIt>',
                to:          mail.to,
                subject:     mail.subject,   
                html:        html
            });
        });
}



/* 
    Send mail
    @param 
        {string}    [from]      sender
        {string}    to          reciepient of email
        {string}    template    mail template @ emails folder
        {string}    subject     mail subject
        {string}    data        mail data
    
    @return Promise
    @sample
        let subject = 'Sample Mail Request';
        let to = 'jairo@codedisruptors.com';
        let from = 'CDI <jeeves@codedisruptors.com>';
        let template = 'test-mailer';
        let data = {
            name: 'Jairo Malanay',
            sender: 'Sender: Jairo Malanay'
        };
        mailer.send({
            to,
            from,
            data,
            subject,
            template
        }).then(console.log).catch(console.error);
*/
exports.send = (param) => {
    const {
        to,
        from,
        template,
        subject,
        data,
    } = param;

    if (!template) {
        throw new Error('Missing template');
    }

    if (!to) {
        throw new Error('Missing to');
    }

    if (!subject) {
        throw new Error('Missing subject');
    }

    if (!data) {
        throw new Error('Missing data');
    }

    if (typeof data !== 'object') {
        throw new Error('Invalid data');
    }


    const mailData = {
        transporter: setTransporter(),
        template,
        from,
        to,
        subject,
        data,
    };

    return sendMail(mailData);

};