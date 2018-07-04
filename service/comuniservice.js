var comuniservice = require('./comuniservice')
var comunidao = require('../dao/comunidao')
var gestionaleLogger = require("../utility/gestionaleLogger");
var pool = require('../connection/connection.js'); // db is pool
var transaction = require('../connection/transactionUtils.js'); // transaction management

comuniservice.getComuneByCodIstat = function(id, cb){
    gestionaleLogger.logger.debug('comuniservice- getComuneByCodIstat');
    transaction.getConnection(pool,function(connection) {
        comunidao.getComuneByCodIstat(id, connection, function(err, data){
            if (err) return cb(err);
            return cb(null,data)
        });
    });    
}
comuniservice.getCapByComune = function(comune, cb){
    gestionaleLogger.logger.debug('comuniservice- getCapByComune');
    transaction.getConnection(pool,function(connection) {
        comunidao.getCapByComune(comune, connection, function(err, data){
            if (err) return cb(err);
            var arr=new Array();
            var retObj = {};
            if(data && data.length>0){
                for(var j in data){
                    arr.push(data[j].CAP);
                }
                retObj.cap=arr;
            }
            
            return cb(null,retObj)
        });
    });    
}



comuniservice.getComuniPagedSearch = function(filter, cb){
    gestionaleLogger.logger.debug('comuniservice- getComuniPagedSearch');
    transaction.getConnection(pool,function(connection) {
        comunidao.getComuniPagedSearch(filter, connection, function(err, data){
            if (err) return cb(err);
            return cb(null,data)
        });
    });    
}

comuniservice.getComuni = function(filter, cb){
    gestionaleLogger.logger.debug('comuniservice- getComuni');
    transaction.getConnection(pool,function(connection) {
        comunidao.getComuni(filter, connection, function(err, data){
            if (err) return cb(err);
            return cb(null,data)
        });
    });    
}

module.exports = comuniservice;