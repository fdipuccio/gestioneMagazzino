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


udmfactory.getVolumeUdms = function(connection,cb){
    gestionaleLogger.logger.debug('udmfactory::getVolumeUdms');
    var sql ='SELECT * FROM AN_UDM_VOLUME ';
    gestionaleLogger.logger.debug('sql',sql);
    connection.query(sql, function (err, rows) {
        if (err){
            gestionaleLogger.logger.error('udmfactory.getVolumeUdms - Internal error: ', err);
            return cb(err);
        }
        else {
            gestionaleLogger.logger.debug('rows',rows);
            return cb(null,rows)
        }
    });    
};

udmfactory.getPesoUdms = function(connection,cb){
    gestionaleLogger.logger.debug('udmfactory::getPesoUdms');
    var sql ='SELECT * FROM AN_UDM_PESO ';
    gestionaleLogger.logger.debug('sql',sql);
    connection.query(sql, function (err, rows) {
        if (err){
            gestionaleLogger.logger.error('udmfactory.getPesoUdms - Internal error: ', err);
            return cb(err);
        }
        else {
            gestionaleLogger.logger.debug('rows',rows);
            return cb(null,rows)
        }
    });    
};


udmfactory.getQtyScatolaUdms = function(connection,cb){
    gestionaleLogger.logger.debug('udmfactory::getQtyScatolaUdms');
    var sql ='SELECT * FROM AN_UDM_QTY_SCATOLA ';
    gestionaleLogger.logger.debug('sql',sql);
    connection.query(sql, function (err, rows) {
        if (err){
            gestionaleLogger.logger.error('udmfactory.getQtyScatolaUdms - Internal error: ', err);
            return cb(err);
        }
        else {
            gestionaleLogger.logger.debug('rows',rows);
            return cb(null,rows)
        }
    });    
};


udmfactory.getLunghezzaUdms = function(connection,cb){
    gestionaleLogger.logger.debug('udmfactory::getLunghezzaUdms');
    var sql ='SELECT * FROM AN_UDM_LUNGHEZZA ';
    gestionaleLogger.logger.debug('sql',sql);
    connection.query(sql, function (err, rows) {
        if (err){
            gestionaleLogger.logger.error('udmfactory.getLunghezzaUdms - Internal error: ', err);
            return cb(err);
        }
        else {
            gestionaleLogger.logger.debug('rows',rows);
            return cb(null,rows)
        }
    });    
};

udmfactory.getCapacitaUdms = function(connection,cb){
    gestionaleLogger.logger.debug('udmfactory::getCapacitaUdms');
    var sql ='SELECT * FROM AN_UDM_CAPACITA ';
    gestionaleLogger.logger.debug('sql',sql);
    connection.query(sql, function (err, rows) {
        if (err){
            gestionaleLogger.logger.error('udmfactory.getCapacitaUdms - Internal error: ', err);
            return cb(err);
        }
        else {
            gestionaleLogger.logger.debug('rows',rows);
            return cb(null,rows)
        }
    });    
};


udmfactory.getDiametroUdms = function(connection,cb){
    gestionaleLogger.logger.debug('udmfactory::getDiametroUdms');
    var sql ='SELECT * FROM AN_UDM_DIAMETRO ';
    gestionaleLogger.logger.debug('sql',sql);
    connection.query(sql, function (err, rows) {
        if (err){
            gestionaleLogger.logger.error('udmfactory.getDiametroUdms - Internal error: ', err);
            return cb(err);
        }
        else {
            gestionaleLogger.logger.debug('rows',rows);
            return cb(null,rows)
        }
    });    
};



module.exports = udmfactory;