const sgMail = require('@sendgrid/mail')
const catchAsync = require('../utils/catchAsync')


exports.sendContactMail = catchAsync(async (req, res, next) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const subject = req.body.subject;
    const text = `From : ${req.body.name} -- ${req.body.email}\n Subject: ${req.body.subject} \n Message : ${req.body.message}`;
    const msg = {
        to: 'contactus@saavishkaara.com',
        from:'contactus@saavishkaara.com',
        subject,
        text,
    }
    var resp = await sgMail.send(msg);
    res.status(200).json({ status: 'success', response : resp });
});


