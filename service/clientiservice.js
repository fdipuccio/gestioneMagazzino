var clientiservice = require('./clientiservice')
var clientidao = require('../dao/clientidao')
var pool = require('../connection/connection.js'); // db is pool
var transaction = require('../connection/transactionUtils.js'); // transaction management
var gestionaleLogger = require("../utility/gestionaleLogger");

var ret;
var retObj={};



clientiservice.exportCustomers = function(customersFilter, cb){
    gestionaleLogger.logger.debug('clientiservice- exportCustomers');
    retObj={};
    transaction.getConnection(pool,function(connection) {
        clientidao.exportCustomers(customersFilter,connection, function(err, data){
            if (err){
                retObj.status='KO';
                retObj.code=err[0]!=undefined?err[0]:'000';
                retObj.message=err[1]!=undefined?err[1]:'Generic Error';
                return cb(retObj,null);}
            retObj.status='OK';
            retObj.totaleFatture=data[0].TOTALE_FATTURE;
            retObj.totalePagato=data[0].TOTALE_PAGATO;
            retObj.percentualePagato=data[0].PERC_PAGATO;
            return cb(null,retObj)  
        });
    });    
}

clientiservice.advancedSearch =function(filter,cb){
    retObj={};
    gestionaleLogger.logger.debug('clientiservice- advancedSearch');
    transaction.getConnection(pool,function(connection) {
        clientidao.advancedSearch(filter,connection, function(err, data){
            if (err){
                retObj.status='KO';
                retObj.code=err[0]!=undefined?err[0]:'000';
                retObj.message=err[1]!=undefined?err[1]:'Generic Error';
                return cb(retObj,null);}
            retObj.status='OK';
            retObj.customers=data;
            return cb(null,retObj)       
        });
    });
}

clientiservice.readCustomers =function(filter,cb){
    retObj={};
    gestionaleLogger.logger.debug('clientiservice- readCustomers');
    transaction.getConnection(pool,function(connection) {
        clientidao.readCustomers(filter,connection, function(err, data){
            if (err){
                retObj.status='KO';
                retObj.code=err[0]!=undefined?err[0]:'000';
                retObj.message=err[1]!=undefined?err[1]:'Generic Error';
                return cb(retObj,null);}
            retObj.status='OK';
            retObj.customers=data;
            return cb(null,retObj)       
        });
    });
}


clientiservice.getCustomerById = function(id,deleted, cb){
    retObj={};
    gestionaleLogger.logger.debug('clientiservice- getCustomerById');
    transaction.getConnection(pool,function(connection) {
        clientidao.getCustomerById(id,deleted,connection, function(err, data){
            if (err){
                retObj.status='KO';
                retObj.code=err[0]!=undefined?err[0]:'000';
                retObj.message=err[1]!=undefined?err[1]:'Generic Error';
                return cb(retObj,null);}
            retObj.status='OK';
            retObj.customer=data;
            return cb(null,retObj)    
        });
    });    
}

clientiservice.addCustomer =function(nome, indirizzo, citta, cap, provincia,
                                    nazione, note_extra_indirizzo, partita_iva, codice_fiscale, mail,
                                    telefono, fax, note_cliente, pag_x_gg_fattura, pag_x_gg_fine_mese, iva_applicata_prod, iva_applicata_serv,
                                    fatt_elettronica_pz,idModPagamentoFattura,conto,cb){    
    gestionaleLogger.logger.debug('clientiservice- addCustomer');    
    retObj={};
    transaction.inTransaction(pool, function(connection, next) {
        var filter = {};
        var msg ;
                if(partita_iva!=null){
                    filter.partita_iva=partita_iva;
                    msg="PARTITA IVA";

                }else if( codice_fiscale !=null){
                    filter.codice_fiscale=codice_fiscale;
                    msg="CODICE FISCALE";
                }
                
                var isCliente;
                clientidao.readCustomers(filter,connection,function(err, data){
                    if(data && data.length>0){
                        return next (['CLI001', msg+' GIA PRESENTE']);   
                    }

                    clientidao.addCustomer(nome, indirizzo, citta, cap, provincia,
                        nazione, note_extra_indirizzo, partita_iva, codice_fiscale, mail,
                        telefono, fax, note_cliente, pag_x_gg_fattura, pag_x_gg_fine_mese, iva_applicata_prod, iva_applicata_serv,
                        fatt_elettronica_pz,idModPagamentoFattura,connection,function(err, data){

                                ret=data;      
                                if(conto!=undefined){
                                    clientidao.addCustomerAccount(data.id, conto.iban, conto.banca, conto.note,connection,function(err1, dataAccount){
                                        if(err1 || err) return next(['CL001','Problemi connessione alla Base Dati']);
                                        retAccount=dataAccount;
                                        return next(null);
                                    });
                                }else{
                                    return next(null);
                                }
                           
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
                retObj.idCliente=ret.id;
                if(conto!= undefined || conto!=null){
                retObj.idContoCliente=retAccount.id;
                }
                return cb(null,retObj)       
         });   
}

clientiservice.updateCustomer =function(id,nome, indirizzo, citta, cap, provincia,
                                        nazione, note_extra_indirizzo, partita_iva, codice_fiscale, mail,
                                        telefono, fax, note_cliente, pag_x_gg_fattura, pag_x_gg_fine_mese, iva_applicata_prod, iva_applicata_serv,
                                        fatt_elettronica_pz,idModPagamentoFattura,cb){
    
    gestionaleLogger.logger.debug('clientiservice-updateCustomer');
    retObj={};
    transaction.inTransaction(pool, function(connection, next) {
    clientidao.updateCustomer(id,nome, indirizzo, citta, cap, provincia,
        nazione, note_extra_indirizzo, partita_iva, codice_fiscale, mail,
        telefono, fax, note_cliente, pag_x_gg_fattura, pag_x_gg_fine_mese, iva_applicata_prod, iva_applicata_serv,
        fatt_elettronica_pz,idModPagamentoFattura, connection, function(err,data){
            if(err) return next(['CL001','Problemi connessione alla Base Dati']);
            ret=id;
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
        retObj.idCliente=ret;
        return cb(null,retObj)         
        });
}


clientiservice.deleteCustomer = function(id, cb){
    gestionaleLogger.logger.debug('clientiservice- deleteclienti');
    retObj={};
    ret = undefined;
    transaction.inTransaction(pool, function(connection, next) {        
		clientidao.deleteCustomer(id,connection,function(err,data){
                if(err) return next(['CL001','Problemi connessione alla Base Dati']);
                data.status='OK';
                ret=data;
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
            if(ret)retObj.idCliente=ret;
            return cb(retObj,null)     
        });
    
}

module.exports = clientiservice;