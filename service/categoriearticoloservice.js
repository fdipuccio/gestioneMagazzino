var categoriearticoloservice = require('./categoriearticoloservice')
var categoriearticolodao = require('../dao/categoriearticolodao')
var categoriearticolomapper = require('../mapper/categoriearticolomapper')
var pool = require('../connection/connection.js'); // db is pool
var transaction = require('../connection/transactionUtils.js'); // transaction management
var gestionaleLogger = require("../utility/gestionaleLogger");
var retObj={};


categoriearticoloservice.getAll= function(cb){
    gestionaleLogger.logger.debug('categoriearticoloservice-readcategoriearticoloCategories');
    transaction.getConnection(pool,function(connection) {
        var retObj = {};
        categoriearticolodao.getAll(connection, function(err, data){
            if (err){
                retObj.status='KO';
                retObj.code=err[0]!=undefined?err[0]:'CAT001';
                retObj.message=err[1]!=undefined?err[1]:'Errore recupero categorie articolo';
                return cb(retObj,null);
            }
            retObj.status='OK';
            retObj.categorie=categoriearticolomapper.CATEGORIA_OUT_LISTA(data);
            return cb(null,retObj);
        });
    });
}

categoriearticoloservice.getById = function(idCategoria, cb){
    gestionaleLogger.logger.debug('categoriearticoloservice-getById');
    transaction.getConnection(pool,function(connection) {
        var retObj = {};
        categoriearticolodao.getById(idCategoria, connection, function(err, data){
            if (err){
                retObj.status='KO';
                retObj.code=err[0]!=undefined?err[0]:'CAT002';
                retObj.message=err[1]!=undefined?err[1]:'Errore recupero categoria by id';
                return cb(retObj,null);
            }
            retObj.status='OK';
            retObj.categoria=categoriearticolomapper.CATEGORIA_OUT(data[0]);
            return cb(null,retObj);
        });
    });
}

categoriearticoloservice.deleteById = function(idCategoria, cb){
    gestionaleLogger.logger.debug('categoriearticoloservice- deleteById');
    var retObj={}
    var ret="";
    transaction.inTransaction(pool, function(connection, next) {
        categoriearticolodao.deleteById(idCategoria,connection,function(errPutCategoria,data){
            if(errPutCategoria) return next(['CAT005','Errore Cancellazione Categoria']);
                ret=data;
                return next(null);
            });        
        }, function(err) {
            if (err){
                retObj.status='KO';
                retObj.code=err[0]!=undefined?err[0]:'CAT005';
                retObj.message=err[1]!=undefined?err[1]:'Errore Cancellazione Categoria';
                return cb(retObj,null);
            }
            retObj.status='OK';        
            return cb(null,retObj);            
    });
}

categoriearticoloservice.postCategoria = function(categoria, cb){
    gestionaleLogger.logger.debug('categoriearticoloservice- postCategoria');
    var retObj={}
    var ret="";
    transaction.inTransaction(pool, function(connection, next) {
        categoriearticolodao.postCategoria(categoria,connection,function(erraddCategoria,data){
            if(erraddCategoria) return next(['CAT003','Errore Inserimento Categoria']);
                ret=data;
                return next(null);
            });        
        }, function(err) {
            if (err){
                retObj.status='KO';
                retObj.code=err[0]!=undefined?err[0]:'CAT003';
                retObj.message=err[1]!=undefined?err[1]:'Errore Inserimento Categoria';
                return cb(retObj,null);
            }
            retObj.status='OK';
            retObj.IdCategoria=ret;        
            return cb(null,retObj);            
    });
}

categoriearticoloservice.putCategoria = function(idCategoria,categoria, cb){
    gestionaleLogger.logger.debug('categoriearticoloservice- putCategoria');
    var retObj={}
    var ret="";
    transaction.inTransaction(pool, function(connection, next) {
        categoriearticolodao.putCategoria(idCategoria,categoria,connection,function(errPutCategoria,data){
            if(errPutCategoria) return next(['CAT004','Errore Modifca Categoria']);
                ret=data;
                return next(null);
            });        
        }, function(err) {
            if (err){
                retObj.status='KO';
                retObj.code=err[0]!=undefined?err[0]:'CAT004';
                retObj.message=err[1]!=undefined?err[1]:'Errore Modifca Categoria';
                return cb(retObj,null);
            }
            retObj.status='OK';
            retObj.IdCategoria=idCategoria;        
            return cb(null,retObj);            
    });
}
    
    



module.exports = categoriearticoloservice;