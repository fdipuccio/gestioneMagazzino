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

module.exports = udmservice;