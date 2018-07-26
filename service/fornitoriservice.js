var fornitoriservice = require('./fornitoriservice')
var fornitoridao = require('../dao/fornitoridao')
var pool = require('../connection/connection.js'); // db is pool
var transaction = require('../connection/transactionUtils.js'); // transaction management
var gestionaleLogger = require("../utility/gestionaleLogger");
var transaction = require('../connection/transactionUtils.js'); // transaction management
var fornitorimapper = require('../mapper/fornitorimapper')

fornitoriservice.getSupplierById = function(id, cb){
    var retObj={};
    gestionaleLogger.logger.debug('fornitoriservice- getSupplierById');
    transaction.getConnection(pool,function(connection) {        
	  fornitoridao.getSupplierById(id,connection, function(err, data){
          if (err || !data){
                retObj.status='KO';
                retObj.code=err && err[0]!=undefined?err[0]:'FOR000';
                retObj.message=err && err[1]!=undefined?err[1]:'Errore Recupero fornitore by id';
                return cb(retObj,null);
            }
            retObj.status='OK';
            retObj.supplier=fornitorimapper.FORNITORE_OUT(data);
            return cb(null,retObj) 
        });
    });
}


fornitoriservice.addSupplier =function(supplier, cb){
    var retObj={};
	var idf;
    gestionaleLogger.logger.debug('fornitoriservice- addSupplier');
    transaction.inTransaction(pool, function(connection, next) {        
	  fornitoridao.addSupplier(supplier,connection,function(err, data){
        if(err) return next (['FOR001','Problemi connessione alla Base Dati']);
		idf = data;
        return next(null);                  
      });
    }, function(err) {
        gestionaleLogger.logger.debug('err',err);
        if (err){
                retObj.status='KO';
                retObj.code=err[0]!=undefined?err[0]:'000';
                retObj.message=err[1]!=undefined?err[1]:'Generic Error';
                return cb(retObj,null);
            }
            retObj.status='OK';
            retObj.idFornitore=idf;            
            return cb(null,retObj) 
        });
}


fornitoriservice.updateSupplier =function(id, fornitore, cb){
    gestionaleLogger.logger.debug('fornitoriservice- updateSupplier');
    var retObj={};
    transaction.inTransaction(pool, function(connection, next) {                
        fornitoridao.updateSupplier(id, fornitore, connection, function(err, data){
                if(err) return next (['FOR002','Problemi connessione alla Base Dati']);
                return next(null);                  
            });
        }, function(err) {
            gestionaleLogger.logger.debug('err',err);
            if (err){
                retObj.status='KO';
                retObj.code=err[0]!=undefined?err[0]:'000';
                retObj.message=err[1]!=undefined?err[1]:'Generic Error';
                return cb(retObj,null);
            }
        retObj.status='OK';
        retObj.idFornitore=id;
        return cb(null,retObj)         
        });
}


fornitoriservice.advancedSearch =function(filter,cb){
    var retObj={};
    gestionaleLogger.logger.debug('fornitoriservice- advancedSearch');
    transaction.getConnection(pool,function(connection) {
        fornitoridao.advancedSearch(filter,connection, function(err, data){
            if (err){
                retObj.status='KO';
                retObj.code=err[0]!=undefined?err[0]:'000';
                retObj.message=err[1]!=undefined?err[1]:'Generic Error';
                return cb(retObj,null);}
            retObj.status='OK';
            retObj.suppliers=fornitorimapper.FORNITORE_OUT_LISTA(data);
            return cb(null,retObj)       
        });
    });
}


fornitoriservice.deleteSupplier = function(id, cb){
    gestionaleLogger.logger.debug('fornitoriservice- deletefornitori');
    var retObj={};
    transaction.inTransaction(pool, function(connection, next) {   
        fornitoridao.canBeDeleted(id,connection,function(error, canDelete){
            if(error) return next (['FOR003','Problemi connessione alla Base Dati']);
            if(!canDelete) return next (['FOR004','Non è consentito cancellare il fornitore']);
            fornitoridao.deleteSupplier(id,connection,function(err, data){
                if(err) return next (['FOR003','Problemi connessione alla Base Dati']);
                return next(null);                  
            });
        });
    }, function(err) {
        gestionaleLogger.logger.debug('err',err);
        if (err){
        retObj.status='KO';
        retObj.code=err[0]!=undefined?err[0]:'000';
        retObj.message=err[1]!=undefined?err[1]:'Generic Error';
        return cb(retObj,null);}
    retObj.status='OK';
    return cb(null,retObj)         
    });
}


module.exports = fornitoriservice;