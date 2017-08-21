var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'quantadumdum@gmail.com',
    pass: 'Raj27Naj'
  }
});

var mailOptions = {
  from: 'quantadumdum@gmail.com',
  to: 'lauzier.ma@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});