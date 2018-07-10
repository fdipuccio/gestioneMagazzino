var magazzinoservice = require('./magazzinoservice')
var magazzinodao = require('../dao/magazzinodao')
var gestionaleLogger = require("../utility/gestionaleLogger");
var pool = require('../connection/connection.js'); // db is pool
var transaction = require('../connection/transactionUtils.js'); // transaction management

magazzinoservice.getMagazzini = function(cb){
    gestionaleLogger.logger.debug('magazzinoservice- getMagazzini');
    transaction.getConnection(pool,function(connection) {
        magazzinodao.getMagazzini(connection, function(err, data){
            if (err) return cb(err);
            return cb(null,data)
        });
    });
}

magazzinoservice.getMagazzinoById = function(idMagazzino, cb){
    gestionaleLogger.logger.debug('magazzinoservice- getMagazzinoById');
    transaction.getConnection(pool,function(connection) {
        magazzinodao.getMagazzinoById(idMagazzino, connection, function(err, data){
            if (err) return cb(err);
            return cb(null,data)
        });
    });
}

magazzinoservice.addMagazzino = function(magazzino, cb){
    gestionaleLogger.logger.debug('magazzinoservice- addMagazzino');
    var retObj={}
    var ret;
    transaction.inTransaction(pool, function(connection, next) {
        magazzinodao.addMagazzino(magazzino,connection,function(erraddMagazzino,data){
            if(erraddMagazzino) return next(['MGZ001','Errore Crazione nuovo magazzino']);
            ret=data;
            return next(null);
        });
        }, function(err) {
            if (err){
                retObj.status='KO';
                retObj.code=err[0]!=undefined?err[0]:'MGZ001';
                retObj.message=err[1]!=undefined?err[1]:'Errore Crazione nuovo magazzino';
                return cb(retObj,null);
            }
            retObj.status='OK';
            retObj.IdMagazzino=ret.insertId;   
            return cb(null,retObj);            
    });
}

magazzinoservice.putMagazzino = function(idMagazzino, magazzino, cb){
    gestionaleLogger.logger.debug('magazzinoservice- putMagazzino');
    var retObj={}
    transaction.inTransaction(pool, function(connection, next) {
        magazzinodao.putMagazzino(idMagazzino, magazzino,connection,function(errputMagazzino,data){
            if(errputMagazzino) return next(['MGZ002','Errore Modifica magazzino']);
            return next(null);
        });
        }, function(err) {
            if (err){
                retObj.status='KO';
                retObj.code=err[0]!=undefined?err[0]:'MGZ002';
                retObj.message=err[1]!=undefined?err[1]:'Errore Modifica magazzino';
                return cb(retObj,null);
            }
            retObj.status='OK';
            retObj.IdMagazzino=idMagazzino;   
            return cb(null,retObj);            
    });
}

magazzinoservice.deleteMagazzino = function(idMagazzino, cb){
    gestionaleLogger.logger.debug('magazzinoservice- deleteMagazzino');
    var retObj={}
    transaction.inTransaction(pool, function(connection, next) {
        magazzinodao.deleteMagazzino(idMagazzino,connection,function(errdelMagazzino,data){
            if(errdelMagazzino) return next(['MGZ003','Errore Cancellazione magazzino']);
            return next(null);
        });
        }, function(err) {
            if (err){
                retObj.status='KO';
                retObj.code=err[0]!=undefined?err[0]:'MGZ003';
                retObj.message=err[1]!=undefined?err[1]:'Errore Cancellazione magazzino';
                return cb(retObj,null);
            }
            retObj.status='OK';
            return cb(null,retObj);            
    });
}





module.exports = magazzinoservice;