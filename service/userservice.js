var userservice = require('./userservice')
var userdao = require('../dao/userdao')
var pool = require('../connection/connection.js'); // db is pool
var transaction = require('../connection/transactionUtils.js'); // transaction management
var gestionaleLogger = require("../utility/gestionaleLogger");
var passwordValidator = require('password-validator');
var mailservice = require('./mailservice')
var config = require('../utility/config');
var crypto = require('crypto');
var retObj={};

userservice.readUser = function(req, res, cb){
	gestionaleLogger.logger.debug('userservice');
	transaction.getConnection(pool,function(connection) {        		
	  userdao.readUser(req, res,connection, function(err, data){
          if (err) return cb(err);
			return cb(null,data)
				});
			});
}

userservice.searchUtenti = function(filter, cb){
	gestionaleLogger.logger.debug('userservice - searchUtenti');
	retObj={};
	transaction.getConnection(pool,function(connection) {        		
	  	userdao.searchUtenti(filter,connection, function(err, data){
          	if (err){
				retObj.status='KO';
				retObj.code=err[0]!=undefined?err[0]:'000';
				retObj.message=err[1]!=undefined?err[1]:'Generic Error';
				return cb(retObj,null);
			}
			retObj.status='OK';
			retObj.utenti=data;
			return cb(null,retObj)  
		});
	});
}

userservice.getUserById = function(id, cb){
	gestionaleLogger.logger.debug('userservice- getUserById');
	transaction.getConnection(pool,function(connection) {        				
		userdao.getUserById(id, connection,function(err, data){
			if (err) return cb(err);
			return cb(null,data)
		});
	});
}

userservice.getUserByEmail = function(email, cb){
	gestionaleLogger.logger.debug('userservice- getUserByEmail');
	transaction.getConnection(pool,function(connection) {        				
		userdao.getUserByEmail(email, connection,function(err, data){
			if (err) return cb(err);
			return cb(null,data)
		});
	});
}


userservice.adduser = function(username,password,email,idprofilo,enabled,force_change_pwd ,cb){
	var res=null;
	retObj={};
	gestionaleLogger.logger.debug('userservice- adduser');
	transaction.inTransaction(pool, function(connection, next) {
	  userdao.getUserByName(username,connection, function(err,data){
		  if(err)  return next (['US001','Problemi connessione alla Base Dati']);
		  if(data && data.length>0)  return next (['US002','Username già in uso']);
				userdao.adduser(username,password,email,idprofilo,enabled,force_change_pwd,connection,function(err,data){
					if(err)  return next (['US001','Problemi connessione alla Base Dati']);
					res=data;
					return next(null);	
					});
			});
	}, function(err) {
		gestionaleLogger.logger.debug('err',err);
		if (err){
            retObj.status='KO';
            retObj.code=err[0]!=undefined?err[0]:'000';
            retObj.message=err[1]!=undefined?err[1]:'Generic Error';
            return cb(retObj,null);}
        retObj.status='OK';
        retObj.idUtente=res
        return cb(null,retObj)    

});
	}	

userservice.changePassword = function(username, oldPwd, pwd ,cb){
	gestionaleLogger.logger.debug('userservice- updateuser');
	retObj={};
    
	if(userservice.validatePwd(pwd)){
		transaction.inTransaction(pool, function(connection, next) {	
			userdao.getUserByNameAndPassword(username, oldPwd, connection, function(err1, utente){
				if(err1) next(null);
				if(!utente || utente.length == 0) next("Utente non trovato");
				userdao.updateuser(utente[0].IDUTENTE,undefined,pwd,undefined,undefined,undefined,undefined,undefined, undefined, connection,function(err, data){
					if(err) next(err);
					return next(null);  
				});
			});

		}, function(err) {
			gestionaleLogger.logger.debug('err',err);
			if (err){
				retObj.status='KO';
				retObj.code=err[0]!=undefined?err[0]:'000';
				retObj.message=err[1]!=undefined?err[1]:'Generic Error';
				return cb(retObj,null);
			}
			retObj.status='OK';
			return cb(null,retObj)  
			gestionaleLogger.logger.debug("All done, transaction ended and connection released");        
		});
	}else{
		retObj.status='KO';
		retObj.code='USR100';
		retObj.message='Password non valida';
		return cb(retObj,null);
	}
}



userservice.updateuser = function(idutente,username,password,email,idprofilo,enabled,force_change_pwd, token, expirationToken ,cb){
	gestionaleLogger.logger.debug('userservice- updateuser');	
	transaction.inTransaction(pool, function(connection, next) {	
	  userdao.updateuser(idutente,username,password,email,idprofilo,enabled,force_change_pwd,undefined, undefined,connection,function(err,data){
		if(err) return next(err);

			return next(null)
		});
	}, function(err) {
			gestionaleLogger.logger.debug('err',err);
			if(err)  return cb(err);
			retObj.status='OK';
			retObj.idUtente=idutente
			return cb(null,retObj)    
					gestionaleLogger.logger.debug("All done, transaction ended and connection released");        
			});
}

userservice.deleteuser = function(id, cb){
	gestionaleLogger.logger.debug('userservice- deleteuser');
	transaction.inTransaction(pool, function(connection, next) {			
		userdao.deleteuser(id,connection,function(err,data){
			if(err) return next(err);
			return next(null)
		});
	}, function(err) {
		gestionaleLogger.logger.debug('err',err);
		if(err) return cb(err);
		return cb(null);
		gestionaleLogger.logger.debug("All done, transaction ended and connection released");        
	});
}

userservice.resetPassword = function(token, password, cb){
	retObj={};
	gestionaleLogger.logger.debug('userservice-resetPassword');
	if(!userservice.validatePwd(password)){
		retObj.status='KO';
		retObj.code='USR100';
		retObj.message='Password non valida';
		return cb(retObj,null);
	}else{
		transaction.inTransaction(pool, function(connection, next) {	      				
			userdao.getUserFromToken(token, connection,function(err, user){
				if(err) return next(err);
				if(!user || user.length == 0){
					retObj.status='KO';
					retObj.code='USR010';
					retObj.message='Utente non trovato o token scaduto';
					return next(retObj);
				}else{
					userdao.updateuser(user[0].IDUTENTE,undefined,password,undefined,undefined,undefined,undefined,undefined,undefined, connection,function(errupd, userupd){
						if(errupd) return next(errupd);
						retObj.status='OK';
						return next(null);			
					});
				}			
			});
		}, function(err) {
			gestionaleLogger.logger.debug('err',err);
			if(err) return cb(err, null);
			return cb(null, retObj);
			gestionaleLogger.logger.debug("All done, transaction ended and connection released");        
		});
	}
}


userservice.checkResetPassword = function(token, cb){
	gestionaleLogger.logger.debug('userservice-checkResetPassword');
	retObj={};
	transaction.getConnection(pool,function(connection) {        				
		userdao.getUserFromToken(token, connection,function(err, user){
			if (err){
				retObj.status='KO';
				retObj.code=err[0]!=undefined?err[0]:'USR001';
				retObj.message=err[1]!=undefined?err[1]:'Error get utente from token';
				return cb(retObj);
			}else{
				if(!user || user.length == 0){
					retObj.status='KO';
					retObj.code='USR010';
					retObj.message='Utente non trovato o token scaduto';
					return cb(retObj);
				}else{
					retObj.status='OK';
					retObj.idutente=user[0].IDUTENTE;
					retObj.token=user[0].RESET_PASSWORD_TOKEN;
					return cb(retObj)
				}			
			}			
		});
	});
}

userservice.forgotPassword = function(email, cb){
	gestionaleLogger.logger.debug('userservice- forgotPassword');
	retObj={};
	var tokenPassword;
	transaction.inTransaction(pool, function(connection, next) {      				
		userdao.getUserByEmail(email, connection,function(err, data){
			if (err) return next(err);
			crypto.randomBytes(20, function(err, buf) {
				tokenPassword = buf.toString('hex');
				var expirationToken = new Date();				
				expirationToken.setMilliseconds(expirationToken.getMilliseconds() + config.changepassword_token_expirationperiod);
				var expirationTokenStr = expirationToken.getDate() + "/" + (expirationToken.getMonth() +1 ) + "/" + expirationToken.getFullYear() + " " + expirationToken.getHours() + ":" + expirationToken.getMinutes() + ":" + expirationToken.getSeconds();
				userdao.updateuser(data[0].IDUTENTE,undefined,undefined,undefined,undefined,undefined,undefined,tokenPassword, expirationTokenStr,connection, function(errupd, dataupd){
					if (errupd) return next(errupd);
					var paramtemplate = {
						emailCliente: email,
						token:tokenPassword
					};
					var nometemplate = "template_forgot_password.html";
					var attachments = undefined;
					var subject = config.system_name + "-" + "Reset Password";
					mailservice.sendHTMLMail(email,subject,paramtemplate,nometemplate, attachments,function(errmail, datamail){
						if (errmail) return next(errmail);
						retObj.esitoMail = "OK";
						gestionaleLogger.logger.debug("Token = [" + tokenPassword + "]");
						return next(null);
					});
				});
			});			
		});
	}, function(err) {
		gestionaleLogger.logger.debug('err',err);
		if(err) return cb(err);
		retObj.status='OK';
		return cb(null,retObj)
		gestionaleLogger.logger.debug("All done, transaction ended and connection released");        
	});
}

userservice.validatePwd = function(password){
	var schema = new passwordValidator();
	
	// Add properties to it 
	schema
	.is().min(8)                                    // Minimum length 8 
	.is().max(100)                                  // Maximum length 100 
	.has().uppercase()                              // Must have uppercase letters 
	.has().lowercase()                              // Must have lowercase letters 
	.has().digits()                                 // Must have digits 
	.has().not().spaces()                           // Should not have spaces 
	.is().not().oneOf(['passw0rd', 'Password123']); // Blacklist these values 

	return schema.validate(password);
}

module.exports = userservice;