var configfactory = require('./configfactory');
var pool = require('../connection/connection.js'); // db is pool
var gestionaleLogger = require("../utility/gestionaleLogger");



configfactory.getconfigProperty = function(section, propertyName, connection,cb){
    gestionaleLogger.logger.debug('configfactory::getconfigProperty');
    var sql ='SELECT IFNULL(PROP_VALUE, PROP_DEFAULT) val FROM AN_GESTLAT_CONFIG WHERE PROP_SECTION = '+connection.escape(section) + ' AND PROP_NAME = ' + connection.escape(propertyName);
    gestionaleLogger.logger.debug('sql',sql);
    connection.query(sql, function (err, rows) {
        if (err){
            gestionaleLogger.logger.debug('Internal error: ', err);
            return cb(err);
        }
        else {
            gestionaleLogger.logger.debug('rows',rows);
            if(rows && rows[0]){
                return cb(null, rows[0].val)
            }else{
                return cb(null,null);
            }
            
        }
    });
};


configfactory.getconfigSection = function(section, connection,cb){
    gestionaleLogger.logger.debug('configfactory::getconfigSection');
    var sql ='SELECT PROP_NAME, IFNULL(PROP_VALUE, PROP_DEFAULT) VAL FROM AN_GESTLAT_CONFIG WHERE PROP_SECTION = '+connection.escape(section);
    gestionaleLogger.logger.debug('sql',sql);
    connection.query(sql, function (err, rows) {
        if (err){
            gestionaleLogger.logger.debug('Internal error: ', err);
            return cb(err);
        }
        else {
            gestionaleLogger.logger.debug('rows',rows);
                return cb(null,rows);
        }
    });
};
module.exports = configfactory;