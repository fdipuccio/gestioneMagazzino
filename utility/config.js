var config = require('./config');
config.mail_user="sp3atwonyi72ynwl@ethereal.email";
config.mail_password="QSCSMjsTXGmCAfJwxQ";
config.mail_smtpserver="127.0.0.1";
config.mail_from="sp3atwonyi72ynwl@ethereal.email";
config.mail_subject="Fattura";
config.template_path = "template";
config.invoice_path = "\\temp\\pdf\\";
config.changepassword_token_expirationperiod = 3600000;
config.system_name = "Safety Gestionale";
config.enableCleanArticoliFornitori=true;
config.system_version="1.0.0";
config.system_environment="Sviluppo";

module.exports = config;