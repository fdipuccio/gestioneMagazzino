'use strict';
var logincontroller = require('./logincontroller');
var loginservice = require('../service/loginservice')
var encrypt = require('../utility/encryption');
var gestionaleLogger = require("../utility/gestionaleLogger");

logincontroller.checkLogin = function(req, res, cb){
	gestionaleLogger.logger.debug('logincontroller - checkLogin');
	var username=req.body.username;
    var password=req.body.password;
        loginservice.checkLogin(username,password, function(err, data){
            if (err) return cb(err);
            return cb(null,data)
        });
}

logincontroller.resetPassword = function (req, res, cb) {
    gestionaleLogger.logger.debug('resetPassword - resetPassword');

    var username=req.body.username;
    var oldpassword=req.body.oldpassword;
    var newpassword=req.body.newpassword;

    loginservice.resetPassword(username,oldpassword,newpassword,function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });

};
module.exports = logincontroller;
