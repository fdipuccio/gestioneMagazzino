var articoliservice = require('./articoliservice')
var articolidao = require('../dao/articolidao')
var articolimapper = require('../mapper/articolimapper')
var pool = require('../connection/connection.js'); // db is pool
var transaction = require('../connection/transactionUtils.js'); // transaction management
var gestionaleLogger = require("../utility/gestionaleLogger");
const leftPad = require('left-pad')
var retObj={};


articoliservice.readArticoliCategories= function(cb){
    gestionaleLogger.logger.debug('articoliservice-readArticoliCategories');
        transaction.getConnection(pool,function(connection) {
            var retObj = {};
            articolidao.readArticoliCategories(connection, function(err, data){
                if (err){
                    retObj.status='KO';
                    retObj.code=err[0]!=undefined?err[0]:'FAT008';
                    retObj.message=err[1]!=undefined?err[1]:'Errore recupero Articoli';
                    return cb(retObj,null);}
                retObj.status='OK';
                retObj.categorie=articolimapper.CATEGORIES_OUT(data);
                return cb(null,retObj);
        });
    });
}





articoliservice.searchArticoli= function(filter, cb){
    gestionaleLogger.logger.debug('articoliservice-readArticoliCategories');
        transaction.getConnection(pool,function(connection) {
            var retObj = {};
            articolidao.searchArticoli(filter, connection, function(err, data){
                if (err){
                    retObj.status='KO';
                    retObj.code=err[0]!=undefined?err[0]:'ART008';
                    retObj.message=err[1]!=undefined?err[1]:'Errore recupero Articoli';
                    return cb(retObj,null);
                }
                retObj.status='OK';
                if(!data || !data[0]){
                    retObj.articoli = new Array();
                }else{
                    retObj.articoli=articolimapper.OUT_LISTA(data);   
                }               
                return cb(null,retObj);
        });
    });
}

articoliservice.readArticoliByCategory = function(idCategory,cb){
    var retObj = {};
    gestionaleLogger.logger.debug('articoliservice-readArticoliByCategory');
        transaction.getConnection(pool,function(connection) {
            articolidao.readArticoliByCategory(idCategory, connection, function(err, data){
                if (err){
                    retObj.status='KO';
                    retObj.code=err[0]!=undefined?err[0]:'FAT008';
                    retObj.message=err[1]!=undefined?err[1]:'Errore recupero Articoli per Categorie';
                    return cb(retObj,null);}
                retObj.status='OK';
                if(!data || !data[0]){
                    retObj.categorie = new Array();
                }else{
                    retObj.categorie=articolimapper.OUT_LISTA(data);   
                }   
                return cb(null,retObj);
        });
    });
}

articoliservice.getAndamentoPrezzo = function(idArticolo, startDate, endDate,cb){
    var retObj = {};
    gestionaleLogger.logger.debug('articoliservice-getAndamentoPrezzo');
        transaction.getConnection(pool,function(connection) {
            articolidao.getAndamentoPrezzo(idArticolo, startDate, endDate, connection, function(err, data){
                if (err){
                    retObj.status='KO';
                    retObj.code=err[0]!=undefined?err[0]:'ART008';
                    retObj.message=err[1]!=undefined?err[1]:'Errore recupero Dati per andamento prezzo';
                    return cb(retObj,null);}
                retObj.status='OK';
                if(!data || !data[0]){
                    retObj.dati = new Array();
                }else{
                    retObj.dati=articolimapper.OUT_ANDAMENTO_PREZZI(data);   
                }   
                return cb(null,retObj);
        });
    });
}


articoliservice.getGraficoAcArticolo = function(idArticolo, cb){
    var retObj = {};
    gestionaleLogger.logger.debug('articoliservice-getGraficoAcArticolo');
        transaction.getConnection(pool,function(connection) {
            articolidao.getGraficoAcArticolo(idArticolo, connection, function(err, data){
                if (err){
                    retObj.status='KO';
                    retObj.code=err[0]!=undefined?err[0]:'ART008';
                    retObj.message=err[1]!=undefined?err[1]:'Errore recupero Dati carico e scarico articolo';
                    return cb(retObj,null);}
                retObj.status='OK';
                if(!data || !data[0]){
                    retObj.dati = new Array();
                }else{
                    retObj.dati=articolimapper.OUT_GRAFICO_AC_ARTICOLO(data);   
                }   
                return cb(null,retObj);
        });
    });
}


articoliservice.getDisponibilitaArticolo = function(idArticolo, cb){
    var retObj = {};
    gestionaleLogger.logger.debug('articoliservice-getDisponibilitaArticolo');
        transaction.getConnection(pool,function(connection) {
            articolidao.getDisponibilitaArticolo(idArticolo, connection, function(err, data){
                if (err){
                    retObj.status='KO';
                    retObj.code=err[0]!=undefined?err[0]:'ART008';
                    retObj.message=err[1]!=undefined?err[1]:'Errore recupero Dati per andamento prezzo';
                    return cb(retObj,null);}
                retObj.status='OK';
                if(!data || !data[0]){
                    retObj.dati = new Array();
                }else{
                    retObj.dati=articolimapper.OUT_DISP_ARTICOLI(data);   
                }   
                return cb(null,retObj);
        });
    });
}



articoliservice.getArticoloById = function(id, cb){
    gestionaleLogger.logger.debug('articoliservice- getArticoloById');
    var retObj={}
    transaction.getConnection(pool,function(connection) {  
	    articolidao.getArticoloById(id, connection, function(err, data){
            if (err){
                retObj.status='KO';
                retObj.code=err[0]!=undefined?err[0]:'FAT008';
                retObj.message=err[1]!=undefined?err[1]:'Errore recupero Articolo';
                return cb(retObj,null);}
            retObj.status='OK';
            if(!data || !data[0]){
                retObj.articolo = null;
            }else{
                retObj.articolo=articolimapper.OUT(data[0]);   
            }    
            return cb(null,retObj);
        });
    });
}

articoliservice.getArticoloByCode = function(code, cb){
    gestionaleLogger.logger.debug('articoliservice- getArticoloByCode');
    var retObj={}
    transaction.getConnection(pool,function(connection) {  
	    articolidao.getArticoloByCode(code, connection, function(err, data){
            if (err){
                retObj.status='KO';
                retObj.code=err[0]!=undefined?err[0]:'FAT008';
                retObj.message=err[1]!=undefined?err[1]:'Errore recupero Articolo';
                return cb(retObj,null);}
            retObj.status='OK';
            if(!data || !data[0]){
                retObj.articolo = new Array();
            }else{
                retObj.articolo=articolimapper.OUT(data[0]);   
            } 
            return cb(null,retObj);
        });
    });
}


articoliservice.generateBarcode = function(cb){
    gestionaleLogger.logger.debug('articoliservice- generateBarcode');
    var retObj={}
    transaction.getConnection(pool,function(connection) {  
	    articolidao.getNewBarcode(connection, function(err, maxID){
            if (err){
                retObj.status='KO';
                retObj.code=err[0]!=undefined?err[0]:'ART010';
                retObj.message=err[1]!=undefined?err[1]:'Errore generazione barcode';
                return cb(retObj,null);
            }
            retObj.status='OK';            
            retObj.barcode='P' + leftPad(maxID, 19, '0');
            return cb(null,retObj);
        });
    });
}




articoliservice.addArticolo = function(articolo,cb){
    gestionaleLogger.logger.debug('articoliservice- addarticoli');
    var retObj={}
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
    	
articoliservice.updateArticolo = function(articolo,idArticolo,cb){
    gestionaleLogger.logger.debug('articoliservice- updateArticolo');
    var retObj = {};
    transaction.inTransaction(pool, function(connection, next) {
        articolidao.updateArticolo(articolo,idArticolo,connection,function(error, data){
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
            retObj.IdArticoloUpdated=idArticolo;
            return cb(null,retObj);
                gestionaleLogger.logger.debug("All done, transaction ended and connection released");           
        });
}

articoliservice.deleteArticolo = function(id, cb){ 
    gestionaleLogger.logger.debug('articoliservice- deleteArticolo');
    var retObj = {};
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