var udmservice = require('./udmservice')
var udmdao = require('../dao/udmdao')
var gestionaleLogger = require("../utility/gestionaleLogger");
var pool = require('../connection/connection.js'); // db is pool
var transaction = require('../connection/transactionUtils.js'); // transaction management



udmservice.getUdmById = function(id, cb){
    gestionaleLogger.logger.debug('udmservice- getUdms');
    transaction.getConnection(pool,function(connection) {
        udmdao.getUdmById(id, connection, function(err, data){
            if (err) return cb(err);
            return cb(null,data)
        });
    });    
}

udmservice.getUdms = function(cb){
    gestionaleLogger.logger.debug('udmservice- getUdms');
    transaction.getConnection(pool,function(connection) {
        udmdao.getUdms(connection, function(err, data){
            if (err) return cb(err);
            return cb(null,data)
        });
    });    
}

udmservice.getVolumeUdms = function(cb){
    gestionaleLogger.logger.debug('udmservice- getVolumeUdms');
    transaction.getConnection(pool,function(connection) {
        udmdao.getVolumeUdms(connection, function(err, data){
            if (err) return cb(err);
            return cb(null,data)
        });
    });    
}


udmservice.getPesoUdms = function(cb){
    gestionaleLogger.logger.debug('udmservice- getPesoUdms');
    transaction.getConnection(pool,function(connection) {
        udmdao.getPesoUdms(connection, function(err, data){
            if (err) return cb(err);
            return cb(null,data)
        });
    });    
}

udmservice.getQtyScatolaUdms = function(cb){
    gestionaleLogger.logger.debug('udmservice- getQtyScatolaUdms');
    transaction.getConnection(pool,function(connection) {
        udmdao.getQtyScatolaUdms(connection, function(err, data){
            if (err) return cb(err);
            return cb(null,data)
        });
    });    
}


udmservice.getLunghezzaUdms = function(cb){
    gestionaleLogger.logger.debug('udmservice- getLunghezzaUdms');
    transaction.getConnection(pool,function(connection) {
        udmdao.getLunghezzaUdms(connection, function(err, data){
            if (err) return cb(err);
            return cb(null,data)
        });
    });    
}

udmservice.getCapacitaUdms = function(cb){
    gestionaleLogger.logger.debug('udmservice- getCapacitaUdms');
    transaction.getConnection(pool,function(connection) {
        udmdao.getCapacitaUdms(connection, function(err, data){
            if (err) return cb(err);
            return cb(null,data)
        });
    });    
}

udmservice.getDiametroUdms = function(cb){
    gestionaleLogger.logger.debug('udmservice- getDiametroUdms');
    transaction.getConnection(pool,function(connection) {
        udmdao.getDiametroUdms(connection, function(err, data){
            if (err) return cb(err);
            return cb(null,data)
        });
    });    
}

module.exports = udmservice;