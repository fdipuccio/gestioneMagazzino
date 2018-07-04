var ivaApplicataservice = require('./ivaApplicataservice')
var ivaApplicatadao = require('../dao/ivaApplicatadao')
var gestionaleLogger = require("../utility/gestionaleLogger");
var pool = require('../connection/connection.js'); // db is pool
var transaction = require('../connection/transactionUtils.js'); // transaction management

ivaApplicataservice.getIvaApplicataById = function(cod, cb){
    gestionaleLogger.logger.debug('ivaApplicataservice- getIvaApplicataById');
    transaction.getConnection(pool,function(connection) {
        ivaApplicatadao.getIvaApplicataById(cod, connection, function(err, data){
            if (err) return cb(err);
            return cb(null,data)
        });
    });    
}

ivaApplicataservice.getIvaApplicata = function(cb){
    gestionaleLogger.logger.debug('ivaApplicataservice- getIvaApplicata');
    transaction.getConnection(pool,function(connection) {
        ivaApplicatadao.getIvaApplicata(connection, function(err, data){
            if (err) return cb(err);
            return cb(null,data)
        });
    });    
}

module.exports = ivaApplicataservice;