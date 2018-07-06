var articoliservice = require('./articoliservice')
var articolidao = require('../dao/articolidao')
var pool = require('../connection/connection.js'); // db is pool
var transaction = require('../connection/transactionUtils.js'); // transaction management
var gestionaleLogger = require("../utility/gestionaleLogger");
var retObj={};


articoliservice.readArticoliCategories= function(cb){
    gestionaleLogger.logger.debug('articoliservice-readArticoliCategories');
        transaction.getConnection(pool,function(connection) {
            retObj={}
            articolidao.readArticoliCategories(connection, function(err, data){
                if (err){
                    retObj.status='KO';
                    retObj.code=err[0]!=undefined?err[0]:'FAT008';
                    retObj.message=err[1]!=undefined?err[1]:'Errore recupero Articoli';
                    return cb(retObj,null);}
                retObj.status='OK';
                retObj.categorie=data;
                return cb(null,retObj);
        });
    });
}





articoliservice.searchArticoli= function(filter, cb){
    gestionaleLogger.logger.debug('articoliservice-readArticoliCategories');
        transaction.getConnection(pool,function(connection) {
            retObj={}
            articolidao.searchArticoli(filter, connection, function(err, data){
                if (err){
                    retObj.status='KO';
                    retObj.code=err[0]!=undefined?err[0]:'ART008';
                    retObj.message=err[1]!=undefined?err[1]:'Errore recupero Articoli';
                    return cb(retObj,null);}
                retObj.status='OK';
                retObj.articoli=data;
                return cb(null,retObj);
        });
    });
}

articoliservice.readArticoliByCategory = function(idCategory,cb){
                retObj={};
    gestionaleLogger.logger.debug('articoliservice-readArticoliByCategory');
        transaction.getConnection(pool,function(connection) {
            articolidao.readArticoliByCategory(idCategory, connection, function(err, data){
                if (err){
                    retObj.status='KO';
                    retObj.code=err[0]!=undefined?err[0]:'FAT008';
                    retObj.message=err[1]!=undefined?err[1]:'Errore recupero Categorie per Articolo';
                    return cb(retObj,null);}
                retObj.status='OK';
                retObj.categorie=data;
                return cb(null,retObj);
        });
    });
}

articoliservice.readArticoli = function(cb){
    gestionaleLogger.logger.debug('articoliservice-readArticoli');
    retObj={}
    transaction.getConnection(pool,function(connection) {                               
        articolidao.readArticoli( connection, function(err, data){
            if (err){
                retObj.status='KO';
                retObj.code=err[0]!=undefined?err[0]:'FAT008';
                retObj.message=err[1]!=undefined?err[1]:'Errore recupero Articoli';
                return cb(retObj,null);}
            retObj.status='OK';
            retObj.articoli=data;
            return cb(null,retObj)
        });
    });
}


articoliservice.getArticoloById = function(id, cb){
    gestionaleLogger.logger.debug('articoliservice- getArticoloById');
    retObj={}
    transaction.getConnection(pool,function(connection) {  
	    articolidao.getArticoloById(id, connection, function(err, data){
            if (err){
                retObj.status='KO';
                retObj.code=err[0]!=undefined?err[0]:'FAT008';
                retObj.message=err[1]!=undefined?err[1]:'Errore recupero Articolo';
                return cb(retObj,null);}
            retObj.status='OK';
            retObj.articolo=data;
            return cb(null,retObj);
        });
    });
}

articoliservice.getArticoloByCode = function(code, cb){
    gestionaleLogger.logger.debug('articoliservice- getArticoloByCode');
    retObj={}
    transaction.getConnection(pool,function(connection) {  
	    articolidao.getArticoloByCode(code, connection, function(err, data){
            if (err){
                retObj.status='KO';
                retObj.code=err[0]!=undefined?err[0]:'FAT008';
                retObj.message=err[1]!=undefined?err[1]:'Errore recupero Articolo';
                return cb(retObj,null);}
            retObj.status='OK';
            retObj.articolo=data;
            return cb(null,retObj);
        });
    });
}


articoliservice.getArticoloByCode = function(code, cb){
    gestionaleLogger.logger.debug('articoliservice- getArticoloByCode');
    retObj={}
    transaction.getConnection(pool,function(connection) {  
	    articolidao.getArticoloByCode(code, connection, function(err, data){
            if (err){
                retObj.status='KO';
                retObj.code=err[0]!=undefined?err[0]:'FAT008';
                retObj.message=err[1]!=undefined?err[1]:'Errore recupero Articolo';
                return cb(retObj,null);}
            retObj.status='OK';
            retObj.articolo=data;
            return cb(null,retObj);
        });
    });
}

articoliservice.getArticoloById = function(id, cb){
    transaction.getConnection(pool,function(connection) {
        retObj={}
	console.log('articoliservice- getArticoloById');
      articolidao.getArticoloById(id,connection,function(err, data){
        if (err){
            retObj.status='KO';
            retObj.code=err[0]!=undefined?err[0]:'FAT008';
            retObj.message=err[1]!=undefined?err[1]:'Errore recupero Articolo';
            return cb(retObj,null);}
        retObj.status='OK';
        retObj.articolo=data;
        return cb(null,retObj);
        });
    });
}



articoliservice.advancedsearch = function(filter, ivaProdotto, ivaServizio, cb){
    retObj={}
    gestionaleLogger.logger.debug('articoliservice- advancedsearch');
    transaction.getConnection(pool,function(connection) {  
	    articolidao.advancedsearch(filter, ivaProdotto, ivaServizio, connection, function(err, data){
            if (err){
                retObj.status='KO';
                retObj.code=err[0]!=undefined?err[0]:'FAT008';
                retObj.message=err[1]!=undefined?err[1]:'Errore recupero Articoli';
                return cb(retObj,null);}
            retObj.status='OK';
            retObj.articoli=data;
            return cb(null,retObj);
        });
    });
}


articoliservice.addArticolo = function(articolo,cb){
    gestionaleLogger.logger.debug('articoliservice- addarticoli');
    retObj={}
    var ret="";
    transaction.inTransaction(pool, function(connection, next) {
       articolidao.getArticoloByCode(articolo.codiceArticolo,connection,function(err,data){  
        if(err)  return next (['ART001','Problemi connessione alla Base Dati']);
		  if(data && data.length>0)  return next (['ART002','Articolo in uso']);
	    articolidao.addArticolo(articolo,connection,function(erraddArticolo,data){
            if(erraddArticolo) return next(['ART001','Problemi connessione alla Base Dati']);
            ret=data;
            return next(null);
            });
        });
        }, function(err) {
            if (err){
                retObj.status='KO';
                retObj.code=err[0]!=undefined?err[0]:'ART008';
                retObj.message=err[1]!=undefined?err[1]:'Errore recupero Articoli';
                return cb(retObj,null);}
            retObj.status='OK';
            retObj.IdArticolo=ret;
            gestionaleLogger.logger.debug("All done, transaction ended and connection released");        
            return cb(null,retObj);            
    });
}
    	
articoliservice.updateArticolo = function(articolo,cb){
    gestionaleLogger.logger.debug('articoliservice- updateArticolo');
    transaction.inTransaction(pool, function(connection, next) {
        articolidao.updateArticolo(articolo,connection,function(error, data){
            if(error) return next('Transcation Error');
            return next(null);
            });
        }, function(err) {
            gestionaleLogger.logger.debug('err',err);
            if (err){
                retObj.status='KO';
                retObj.code=err[0]!=undefined?err[0]:'ART008';
                retObj.message=err[1]!=undefined?err[1]:'Errore Update Articoli';
                return cb(retObj,null);}
            retObj.status='OK';
            retObj.IdArticoloUpdated=articolo.idArticolo;
            return cb(null,retObj);
                gestionaleLogger.logger.debug("All done, transaction ended and connection released");           
        });
}

articoliservice.deleteArticolo = function(id, cb){ 
    gestionaleLogger.logger.debug('articoliservice- deleteArticolo');
    transaction.inTransaction(pool, function(connection, next) {
	    articolidao.deleteArticolo(id,connection,function(error, data){
            if(error) return next('Transcation Error');
            return next(null);
            });
        }, function(err) {
            gestionaleLogger.logger.debug('err',err);
            if (err){
                retObj.status='KO';
                retObj.code=err[0]!=undefined?err[0]:'ART009';
                retObj.message=err[1]!=undefined?err[1]:'Errore Delete Articoli';
                return cb(retObj,null);}
            retObj.status='OK';
            retObj.IdArticoloDeleted=id;
            return cb(null,retObj);
                gestionaleLogger.logger.debug("All done, transaction ended and connection released");        
        });
}


module.exports = articoliservice;