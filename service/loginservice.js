var loginservice = require('./loginservice')
var logindao = require('../dao/logindao')
var userdao = require('../dao/userdao')
var gestionaleLogger = require("../utility/gestionaleLogger");
var pool = require('../connection/connection.js'); // db is pool
var transaction = require('../connection/transactionUtils.js'); // transaction management

loginservice.checkLogin = function(username,password,cb){
    gestionaleLogger.logger.debug('loginservice- checkLogin');
    gestionaleLogger.logger.debug('username ',username);
    gestionaleLogger.logger.debug('password ',password);
    transaction.getConnection(pool,function(connection) {
        logindao.checkLogin(username,password,connection, function(err, data){
            if (err) return cb(err);
            return cb(null,data)
        });
    });
}



loginservice.resetPassword = function(username,oldpassword,newpassword,cb){
    gestionaleLogger.logger.debug('loginservice- resetPassword');
    // Ricerco utente se presente in caso affermativo aggiorno password
    transaction.getConnection(pool,function(connection) {
        userdao.getUserByNameAndPassword(username,oldpassword,connection, function(err, data){
      gestionaleLogger.logger.debug('userThatExist: ',data);
        if (err) return cb(err);
        if(data[0]!=undefined){
            logindao.resetPassword(username,newpassword,connection, function(err, data1){
                gestionaleLogger.logger.debug('userupdate: ',data1);
                if (err) return cb(err);
                return cb(null,data1)
            });

        }else
        {
            return cb(null,"KO - User not present")
        }

    });
});
}


module.exports = loginservice;