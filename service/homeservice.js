var homeservice = require('./homeservice')
var homedao = require('../dao/homedao')
var userdao = require('../dao/userdao')
var gestionaleLogger = require("../utility/gestionaleLogger");
var pool = require('../connection/connection.js'); // db is pool
var transaction = require('../connection/transactionUtils.js'); // transaction management


homeservice.getDatiAlertScadenza = function(cb){
    gestionaleLogger.logger.debug('homeservice- getDatiAlertScadenza');
    var retObj = {};
    transaction.getConnection(pool,function(connection) {
        homedao.getDatiAlertScadenza(connection, function(err, data){
            if (err){
                retObj.status='KO';
                retObj.code=err[0]!=undefined?err[0]:'ALR001';
                retObj.message=err[1]!=undefined?err[1]:'Errore recupero Dati per Alert Articoli in Scadenza';
                return cb(retObj,null);}
            retObj.status='OK';
            if(!data || !data[0]){
                retObj.articoli = new Array();
            }else{
                retObj.articoli=homemapper.OUT_ALERT_SCADENZA(data);   
            }   
            return cb(null,retObj);
        });
    });    
}

homeservice.getDatiAlertQuantita = function(cb){
    gestionaleLogger.logger.debug('homeservice- getDatiAlertQuantita');
    var retObj = {};
    transaction.getConnection(pool,function(connection) {
        homedao.getDatiAlertQuantita(connection, function(err, data){
            if (err){
                retObj.status='KO';
                retObj.code=err[0]!=undefined?err[0]:'ALR002';
                retObj.message=err[1]!=undefined?err[1]:'Errore recupero Dati per Alert Articoli Quantità';
                return cb(retObj,null);}
            retObj.status='OK';
            if(!data || !data[0]){
                retObj.articoli = new Array();
            }else{
                retObj.articoli=homemapper.OUT_ALERT_QUANTITA(data);   
            }   
            return cb(null,retObj);
        });
    });    
}


module.exports = homeservice;