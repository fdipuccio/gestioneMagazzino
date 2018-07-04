var mailservice = require('./mailservice')
var gestionaleLogger = require("../utility/gestionaleLogger");
var retObj={};
var fs = require('fs');
var replace = require("replace");
var nodemailer = require('nodemailer');
var config = require('../utility/config')
var appRoot = require('app-root-path');


const transporter = nodemailer.createTransport({
  host: config.mail_smtpserver,
  port: 25//,
  /*auth: {
      user: config.mail_user,
      pass: config.mail_password
  }*/
});

var mailOptions = {
  from: config.mail_from,
  to: 'test@test.com',
  subject: config.mail_subject,
  attachments: [{path :appRoot+config.invoice_path + '/fattura_1.pdf',filename: 'fattura_1.pdf'}] ,
  html: ''
};


mailservice.sendReminder = function(nomecliente,mailcliente,numerofattura,idFattura,nometemplate,cb){
    gestionaleLogger.logger.debug('mailservice.sendReminder');
   
    retObj={}
    var ret;
    var mail_html = '';
    var invoice_attached = '';
    var mail_attachment = '';

    var readStream = fs.createReadStream(config.template_path +'/'+nometemplate, 'utf8');
    
    readStream.on('data', function(chunk) {  
      mail_html += chunk;
    }).on('end', function() {      
      mail_html = mail_html.replace("nomecliente",nomecliente);
      mail_html = mail_html.replace("numerofattura",numerofattura);
    });
  
        mailOptions.html = mail_html;
        mailOptions.to = mailcliente;
        mailOptions.attachments[0].path= appRoot+config.invoice_path+'/fattura_'+idFattura+'.pdf';
        mailOptions.attachments[0].filename= 'fattura_'+idFattura+'.pdf';;
        

        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
            retObj.status='KO';
            retObj.message=error;
          } else {
           
            retObj.status='OK';
            retObj.message='Email sent: ' + info.response;
          }
          console.log('Sending Email : ' + retObj.message);

          return cb(retObj,retObj)
        });


    //});





}



mailservice.sendHTMLMail = function(mailto,subject,paramtemplate,nometemplate, attachments,cb){
  
  retObj={}
  var ret;
  var mail_html = '';
  var invoice_attached = '';
  var mail_attachment = '';

  //load the template
  var readStream = fs.createReadStream(config.template_path +'/'+nometemplate, 'utf8');
  
  //Sets the email subject
  mailOptions.subject = subject;

  //replace placeholder to the template
  readStream.on('data', function(chunk) {  
    mail_html += chunk;
  }).on('end', function() {  
    for (var template in paramtemplate) { 
      mail_html = mail_html.replace("{"+i+"}",paramtemplate[template]);
    }  
  });

  //Set the mail body
  mailOptions.html = mail_html;

  //Set the mail to
  mailOptions.to = mailto;

  //Set the attachement
  var i = 0;
  for (var attach in attachments) { 
    mailOptions.attachments[i].path= appRoot+config.invoice_path+attach;
    mailOptions.attachments[i].filename= attachments[attach];
    i++;
  }  
  if(i == 0){
    mailOptions.attachments = [];
  }
      
  //send the email
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      retObj.status='KO';
      retObj.message=error;
      return cb(retObj,null)
    } else {         
      retObj.status='OK';
      retObj.message='Email sent: ' + info.response;
      return cb(null,retObj)
    }
  });
}


mailservice.sendTXTMail = function(mailto,subject,text,attachments,cb){
  
  retObj={}
  var ret;
  var mail_html = '';
  var invoice_attached = '';
  var mail_attachment = '';

  
  mailOptions.html = mail_html;
  mailOptions.to = mailto;

  var i = 0;
  for (var attach in attachments) { 
    mailOptions.attachments[i].path= appRoot+config.invoice_path+attach;
    mailOptions.attachments[i].filename= attachments[attach];
    i++;
  }    
  if(i == 0){
    mailOptions.attachments = [];
  }    

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      retObj.status='KO';
      retObj.message=error;
      return cb(retObj,null)
    } else {         
      retObj.status='OK';
      retObj.message='Email sent: ' + info.response;
      return cb(null,retObj)
    }
  });
}

 
module.exports = mailservice;