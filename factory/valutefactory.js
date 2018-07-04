var valutefactory = require('./valutefactory');
var pool = require('../connection/connection.js'); // db is pool
var gestionaleLogger = require("../utility/gestionaleLogger");



valutefactory.getValuteById = function(cod, connection,cb){
    gestionaleLogger.logger.debug('valutefactory::getValuteById');
    var sql ='SELECT * FROM AN_VALUTE WHERE  COD = '+connection.escape(cod);
    gestionaleLogger.logger.debug('sql',sql);
    connection.query(sql, function (err, rows) {
        if (err){
            gestionaleLogger.logger.debug('Internal error: ', err);
            return cb(err);
        }
        else {
            gestionaleLogger.logger.debug('rows',rows);
            return cb(null,rows)
        }
    });
};



valutefactory.getValute = function(connection,cb){
    gestionaleLogger.logger.debug('valutefactory::getValute');
    var sql ='SELECT * FROM AN_VALUTE ';
    gestionaleLogger.logger.debug('sql',sql);
    connection.query(sql, function (err, rows) {
        if (err){
            gestionaleLogger.logger.debug('Internal error: ', err);
            return cb(err);
        }
        else {
            gestionaleLogger.logger.debug('rows',rows);
            return cb(null,rows)
        }
    });
};



module.exports = valutefactory;