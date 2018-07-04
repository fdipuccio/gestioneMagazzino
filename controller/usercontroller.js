'use strict';
var usercontroller = require('./usercontroller');
var userservice = require('../service/userservice')
var gestionaleLogger = require("../utility/gestionaleLogger");

	usercontroller.readUser = function(req, res, cb){
	gestionaleLogger.logger.debug('usercontroller');
	  userservice.readUser(req, res, function(err, data){
          if (err) return cb(err);
			return cb(null,data)
        });
}

usercontroller.changePassword = function(req, res, cb){
	gestionaleLogger.logger.debug('usercontroller- changePassword');
	userservice.changePassword(req.body.cngpassword.username, req.body.cngpassword.oldPwd, req.body.cngpassword.pwd ,function(err, data){
		if (err) return cb(err);
		return cb(null,data)
	});
}

usercontroller.searchUtenti = function(req, res, cb){
	gestionaleLogger.logger.debug('usercontroller- searchUtenti');
	var filter = req.body.filter.searchkey;
	userservice.searchUtenti(filter ,function(err, data){
		if (err) return cb(err);
		return cb(null,data)
	});
}


usercontroller.getUserById = function(req, res, cb){
    gestionaleLogger.logger.debug('usercontroller- getUserById');

    userservice.getUserById(req.params.idutente, function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}


usercontroller.getUserByEmail = function(req, res, cb){
    gestionaleLogger.logger.debug('usercontroller- getUserByEmail');
    userservice.getUserByEmail(req.body.email, function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

usercontroller.resetPassword = function(req, res, cb){
	gestionaleLogger.logger.debug('adduser-controller');
	var token = req.params.token;
	var password = req.body.newpassword;
	userservice.resetPassword(token, password, function(err,data){
		return cb(err,data);
	});
}

usercontroller.checkResetPassword = function(req, res, cb){
	gestionaleLogger.logger.debug('adduser-controller');
	var token = req.params.token;
	userservice.checkResetPassword(token, function(ret){
		return cb(ret);
	});
}
usercontroller.forgotPassword = function(req, res, cb){
	gestionaleLogger.logger.debug('adduser-controller');
	var email = req.body.email;
	userservice.forgotPassword(email, function(err,data){
		return cb(err,data);
	});
}
usercontroller.adduser = function(req, res, cb){
	gestionaleLogger.logger.debug('adduser- controller');
	var password=req.body.password;
	var username=req.body.username;
	var email=req.body.email;
	var idprofilo=req.body.idprofilo;
	var enabled=req.body.enabled;
	var force_change_pwd=req.body.force_change_pwd;
	  userservice.adduser(username,password,email,idprofilo,enabled,force_change_pwd,function(err,data){
			return cb(err,data)
        });
}


	usercontroller.updateuser = function(req, res, cb){
	gestionaleLogger.logger.debug('updateuser- controller');
		var idutente=req.params.idutente;
        var password=req.body.password;
        var username=req.body.username;
        var email=req.body.email;
        var idprofilo=req.body.idprofilo;
        var enabled=req.body.enabled;
        var force_change_pwd=req.body.force_change_pwd;
	  userservice.updateuser(idutente,username,password,email,idprofilo,enabled,force_change_pwd,undefined, undefined, function(err,data){
			return cb(err,data)
        });
}

	usercontroller.deleteuser = function(req, res, cb){
	gestionaleLogger.logger.debug('deleteuser- controller');
	  userservice.deleteuser(req.params.idutente,function(data){
            return cb(data)
        });
}

module.exports = usercontroller;
