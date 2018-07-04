var fornitoriservice = require('./fornitoriservice')
var fornitoridao = require('../dao/fornitoridao')
var pool = require('../connection/connection.js'); // db is pool
var transaction = require('../connection/transactionUtils.js'); // transaction management
var gestionaleLogger = require("../utility/gestionaleLogger");
var transaction = require('../connection/transactionUtils.js'); // transaction management

fornitoriservice.getSupplierById = function(id, cb){
    retObj={};
    gestionaleLogger.logger.debug('fornitoriservice- getSupplierById');
    transaction.getConnection(pool,function(connection) {        
	  fornitoridao.getSupplierById(id,connection, function(err, data){
          if (err){
                retObj.status='KO';
                retObj.code=err[0]!=undefined?err[0]:'000';
                retObj.message=err[1]!=undefined?err[1]:'Generic Error';
                return cb(retObj,null);}
            retObj.status='OK';
            retObj.supplier=data;
            return cb(null,retObj) 
        });
    });
}

fornitoriservice.addSupplier =function(supplier, cb){
    retObj={};
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
                return cb(retObj,null);}
            retObj.status='OK';
            retObj.idFornitore=idf;            
            return cb(null,retObj) 
        });
}


fornitoriservice.updateSupplier =function(id, nome, indirizzo, citta, cap, provincia,
        nazione, note_extra_indirizzo, partita_iva, codice_fiscale, mail,
        telefono, fax, note_fornitore, cb){
    gestionaleLogger.logger.debug('fornitoriservice- updateSupplier');
    retObj={};
    transaction.inTransaction(pool, function(connection, next) {                
        fornitoridao.updateSupplier(id, nome, indirizzo, citta, cap, provincia,
            nazione, note_extra_indirizzo, partita_iva, codice_fiscale, mail,
            telefono, fax, note_fornitore, connection, function(err, data){
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
    retObj={};
    gestionaleLogger.logger.debug('fornitoriservice- advancedSearch');
    transaction.getConnection(pool,function(connection) {
        fornitoridao.advancedSearch(filter,connection, function(err, data){
            if (err){
                retObj.status='KO';
                retObj.code=err[0]!=undefined?err[0]:'000';
                retObj.message=err[1]!=undefined?err[1]:'Generic Error';
                return cb(retObj,null);}
            retObj.status='OK';
            retObj.suppliers=data;
            return cb(null,retObj)       
        });
    });
}


fornitoriservice.deleteSupplier = function(id, cb){
    gestionaleLogger.logger.debug('fornitoriservice- deletefornitori');
    transaction.inTransaction(pool, function(connection, next) {                        
	  fornitoridao.deleteSupplier(id,connection,function(err, data){
        if(err) return next (['FOR003','Problemi connessione alla Base Dati']);
        return next(null);                  
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

fornitoriservice.readSuppliers =function (suppliersFilter,cb){
    retObj={};
    gestionaleLogger.logger.debug('fornitoriservice- readSuppliers');
    transaction.getConnection(pool,function(connection) {                
    fornitoridao.readSuppliers(suppliersFilter,connection,function(err,data){
        if (err){
            retObj.status='KO';
            retObj.code=err[0]!=undefined?err[0]:'000';
            retObj.message=err[1]!=undefined?err[1]:'Generic Error';
            return cb(retObj,null);}
        retObj.status='OK';
        retObj.suppliers=data;
        return cb(null,retObj) 
    });
});
}


module.exports = fornitoriservice;