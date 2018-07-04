var loginfactory = require('./loginfactory');
var pool = require('../connection/connection.js'); // db is pool
var func = require('../connection/convertToNested.js');
var gestionaleLogger = require("../utility/gestionaleLogger");

loginfactory.checkLogin = function(username,password,connection,cb){
    gestionaleLogger.logger.debug('loginfactory');
    var sql='SELECT * from vw_users where username = ? and password = MD5( ? ) and ENABLED = 1';
    gestionaleLogger.logger.debug(sql);
    connection.query(sql,[username,password],function(err, results) {
        if (err) {
            gestionaleLogger.logger.error('loginfactory.checkLogin - Internal error: ', err);
            return cb(err);
        }else {
            gestionaleLogger.logger.debug('rows',results);
            return cb(null,results[0])
        }
    });
};


loginfactory.resetPassword = function(username,password,connection,cb){
    gestionaleLogger.logger.debug('resetPassword- Factory');
    var sql=' update us_utenti set password =MD5(?), FORCE_CHANGE_PWD=0 where username = ? ';
    gestionaleLogger.logger.debug(sql);
    connection.query(sql,[password,username],function(err, results) {
        if (err) {
            gestionaleLogger.logger.error('loginfactory.resetPassword - Internal error: ', err);
            return cb(err);
        }else {
            gestionaleLogger.logger.debug('upadte change pwd ' ,results);
            return cb(null,results)
        }
    });
};

module.exports = loginfactory;