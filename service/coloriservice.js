var coloriservice = require('./coloriservice')
var coloridao = require('../dao/coloridao')
var colorimapper = require('../mapper/colorimapper')
var pool = require('../connection/connection.js'); // db is pool
var transaction = require('../connection/transactionUtils.js'); // transaction management
var gestionaleLogger = require("../utility/gestionaleLogger");
var retObj={};


coloriservice.getAll= function(cb){
    gestionaleLogger.logger.debug('coloriservice-getAll');
    transaction.getConnection(pool,function(connection) {
        var retObj = {};
        coloridao.getAll(connection, function(err, data){
            if (err){
                retObj.status='KO';
                retObj.code=err[0]!=undefined?err[0]:'COL001';
                retObj.message=err[1]!=undefined?err[1]:'Errore recupero colori';
                return cb(retObj,null);
            }
            retObj.status='OK';
            retObj.colori=colorimapper.COLORE_OUT_LISTA(data);
            return cb(null,retObj);
        });
    });
}

coloriservice.getById = function(idColore, cb){
    gestionaleLogger.logger.debug('coloriservice-getById');
    transaction.getConnection(pool,function(connection) {
        var retObj = {};
        coloridao.getById(idColore, connection, function(err, data){
            if (err){
                retObj.status='KO';
                retObj.code=err[0]!=undefined?err[0]:'COL002';
                retObj.message=err[1]!=undefined?err[1]:'Errore recupero colore by id';
                return cb(retObj,null);
            }
            retObj.status='OK';
            retObj.colore=colorimapper.COLORE_OUT(data[0]);
            return cb(null,retObj);
        });
    });
}

coloriservice.deleteById = function(idColore, cb){
    gestionaleLogger.logger.debug('coloriservice- deleteById');
    var retObj={}
    var ret="";
    transaction.inTransaction(pool, function(connection, next) {
        coloridao.deleteById(idColore,connection,function(errPutColore,data){
            if(errPutColore) return next(['COL005','Errore Cancellazione Colore']);
                ret=data;
                return next(null);
            });        
        }, function(err) {
            if (err){
                retObj.status='KO';
                retObj.code=err[0]!=undefined?err[0]:'COL005';
                retObj.message=err[1]!=undefined?err[1]:'Errore Cancellazione Colore';
                return cb(retObj,null);
            }
            retObj.status='OK';        
            return cb(null,retObj);            
    });
}

coloriservice.postColore = function(colore, cb){
    gestionaleLogger.logger.debug('coloriservice- postColore');
    var retObj={}
    var ret="";
    transaction.inTransaction(pool, function(connection, next) {
        coloridao.postColore(colore,connection,function(erraddColore,data){
            if(erraddColore) return next(['COL003','Errore Inserimento Colore']);
                ret=data;
                return next(null);
            });        
        }, function(err) {
            if (err){
                retObj.status='KO';
                retObj.code=err[0]!=undefined?err[0]:'CAT003';
                retObj.message=err[1]!=undefined?err[1]:'Errore Inserimento Colore';
                return cb(retObj,null);
            }
            retObj.status='OK';
            retObj.IdColore=ret;        
            return cb(null,retObj);            
    });
}

coloriservice.putColore = function(idColore,colore, cb){
    gestionaleLogger.logger.debug('coloriservice- putColore');
    var retObj={}
    var ret="";
    transaction.inTransaction(pool, function(connection, next) {
        coloridao.putColore(idColore,colore,connection,function(errPutColore,data){
            if(errPutColore) return next(['COL004','Errore Modifca Colore']);
                ret=data;
                return next(null);
            });        
        }, function(err) {
            if (err){
                retObj.status='KO';
                retObj.code=err[0]!=undefined?err[0]:'COL004';
                retObj.message=err[1]!=undefined?err[1]:'Errore Modifca Colore';
                return cb(retObj,null);
            }
            retObj.status='OK';
            retObj.IdColore=idColore;        
            return cb(null,retObj);            
    });
}
    
    



module.exports = coloriservice;