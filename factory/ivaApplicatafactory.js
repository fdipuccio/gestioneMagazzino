var ivaApplicatafactory = require('./ivaApplicatafactory');
var pool = require('../connection/connection.js'); // db is pool
var gestionaleLogger = require("../utility/gestionaleLogger");



ivaApplicatafactory.getIvaApplicataById = function(cod, connection,cb){
    gestionaleLogger.logger.debug('ivaApplicatafactory::getIvaApplicataById');
     var sql ='SELECT * FROM AN_IVA_APPLICATA WHERE  CODICE = '+connection.escape(cod);
     gestionaleLogger.logger.debug('sql',sql);
     connection.query(sql, function (err, rows) {
        if (err){
            gestionaleLogger.logger.error('ivaApplicatafactory.getIvaApplicataById - Internal error: ', err);
            return cb(err);
        }else {
            gestionaleLogger.logger.debug('rows',rows);
            return cb(null,rows)
        }
    });
};



ivaApplicatafactory.getIvaApplicata = function(connection,cb){
    gestionaleLogger.logger.debug('ivaApplicatafactory::getIvaApplicata');
    var sql ='SELECT * FROM AN_IVA_APPLICATA ';
    gestionaleLogger.logger.debug('sql',sql);
    connection.query(sql, function (err, rows) {
        if (err){
            gestionaleLogger.logger.error('ivaApplicatafactory.getIvaApplicata - Internal error: ', err);
            return cb(err);
        }
        else {
            gestionaleLogger.logger.debug('rows',rows);
            return cb(null,rows)
        }
    });
};



module.exports = ivaApplicatafactory;