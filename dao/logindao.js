var logindao = require('./logindao')
var loginfactory = require('../factory/loginfactory')
var gestionaleLogger = require("../utility/gestionaleLogger");

logindao.checkLogin = function(username,password,connection,cb){
    gestionaleLogger.logger.debug('checkLogin');
    loginfactory.checkLogin(username, password, connection,function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

logindao.resetPassword = function(username,password,connection,cb){
    gestionaleLogger.logger.debug('resetPassword');
    loginfactory.resetPassword(username,password, connection,function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

module.exports = logindao;