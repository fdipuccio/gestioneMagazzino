var nodemailer = require('nodemailer');
var mailConfig = require('./mailConfig')


transporter = nodemailer.createTransport({
    host: '127.0.0.1',
    port: 25,
    secure: false // use SSL
    
  });

module.exports = mailConfig;