'use strict';
var mailcontroller = require('./mailcontroller');
var mailservice = require('../service/mailservice')
var gestionaleLogger = require("../utility/gestionaleLogger");


mailcontroller.sendReminder = function(req, res, cb){
	gestionaleLogger.logger.debug('mailcontroller.sendReminder');
	var nomecliente= req.body.nomecliente;
	var mailcliente= req.body.mailcliente;
	var numerofattura= req.body.numerofattura;
	var nometemplate= req.body.nometemplate;
	var idFattura= req.body.idFattura;
	
		mailservice.sendReminder(nomecliente,mailcliente,numerofattura,idFattura,nometemplate,function(err, data){
	    return cb(err, data)
    });
}

module.exports = mailcontroller;
