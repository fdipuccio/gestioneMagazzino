var udmfactory = require('./udmfactory');
var pool = require('../connection/connection.js'); // db is pool
var gestionaleLogger = require("../utility/gestionaleLogger");



udmfactory.getUdmById = function(id, connection,cb){
    gestionaleLogger.logger.debug('udmfactory::getUdmById');
    var sql ='SELECT * FROM AN_UDM WHERE  ID_UDM = '+connection.escape(id);
    gestionaleLogger.logger.debug('sql',sql);
    connection.query(sql, function (err, rows) {
        if (err){
            gestionaleLogger.logger.error('udmfactory.getUdmById - Internal error: ', err);
            return cb(err,null);
        }
        else {
            gestionaleLogger.logger.debug('rows',rows);
            return cb(null,rows)
        }
    });
};



udmfactory.getUdms = function(connection,cb){
    gestionaleLogger.logger.debug('udmfactory::getUdms');
    var sql ='SELECT * FROM AN_UDM ';
    gestionaleLogger.logger.debug('sql',sql);
    connection.query(sql, function (err, rows) {
        if (err){
            gestionaleLogger.logger.error('udmfactory.getUdms - Internal error: ', err);
            return cb(err);
        }
        else {
            gestionaleLogger.logger.debug('rows',rows);
            return cb(null,rows)
        }
    });    
};



module.exports = udmfactory;