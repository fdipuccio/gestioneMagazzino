var magazzinoservice = require('./magazzinoservice')
var magazzinodao = require('../dao/magazzinodao')
var gestionaleLogger = require("../utility/gestionaleLogger");
var pool = require('../connection/connection.js'); // db is pool
var articoliservice = require('../service/articoliservice')
var transaction = require('../connection/transactionUtils.js'); // transaction management
var forEach = require('co-foreach');
var dateUtils  = require('../utility/dateUtils')

magazzinoservice.getMagazzini = function(cb){
    gestionaleLogger.logger.debug('magazzinoservice- getMagazzini');
    var retObj = {};
    transaction.getConnection(pool,function(connection) {
        magazzinodao.getMagazzini(connection, function(err, data){
            if (err){
                retObj.status='KO';
                retObj.code=err[0]!=undefined?err[0]:'000';
                retObj.message=err[1]!=undefined?err[1]:'Generic Error';
                return cb(retObj,null);
            }
            retObj.status='OK';
            retObj.magazzini=data;
            return cb(null,retObj) 
        });
    });
}

magazzinoservice.getMagazzinoById = function(idMagazzino, cb){
    gestionaleLogger.logger.debug('magazzinoservice- getMagazzinoById');
    var retObj = {};
    transaction.getConnection(pool,function(connection) {
        magazzinodao.getMagazzinoById(idMagazzino, connection, function(err, data){
            if (err){
                retObj.status='KO';
                retObj.code=err[0]!=undefined?err[0]:'000';
                retObj.message=err[1]!=undefined?err[1]:'Generic Error';
                return cb(retObj,null);
            }
            retObj.status='OK';
            retObj.magazzino=data;
            return cb(null,retObj) 
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











/*
{  
   "lotto":{  
      "operazione":"CARICO",
      "note":"",
	  "idFornitore":"-1",
      "dataInserimento":"04/07/2018",
	  "prezzoAcquisto":15,
      "dataOperazione":"16/07/2018",
	  "idArticolo":1,
      "articoli":[  
         {  
            "dataScadenza":"06/07/2018",
			"qty":3
            
         },
         {  
            "dataScadenza":"06/07/2018",
			"qty":3
         },
         {  
            "dataScadenza":"14/07/2018",
			"qty":3
         }
      ]
   }
}
*/
magazzinoservice.caricoMagazzino = function(carico, cb){
    gestionaleLogger.logger.debug('magazzinoservice- caricoMagazzino');
    var retObj={}
    var ret;
    var numeroLotto;
    var lotto = {};
    var qtyLotto = 0;
    var mov = {};

    for(var i in carico.articoli){
        qtyLotto += Number(carico.articoli[i].qty);
    }

    transaction.inTransaction(pool, function(connection, next) {
        magazzinodao.generaNumeroLotto(carico.idMagazzino, connection,function(errNLotto,nlotto){
            if(errNLotto) return next(['MGZ006','Errore Generazione numero lotto']);
            numeroLotto=nlotto;
            
            lotto.numero=numeroLotto;
            lotto.note=carico.note;
            lotto.dataCreazione=carico.dataOperazione;
            lotto.utenteInserimento=carico.utenteInserimento;
            lotto.qty=qtyLotto
            lotto.prezzoAcquisto=carico.prezzoAcquisto;
            lotto.idArticolo=carico.idArticolo;
            lotto.idFornitore=carico.idFornitore;

            magazzinodao.addLotto(lotto,connection,function(errLotto,lottoId){
                if(errLotto) return next(['MGZ007','Errore Creazione Lotto']);

                forEach(carico.articoli, function (item, idx) {
                    mov={};
                    mov.lotto=numeroLotto;
                    mov.dataScadenza=item.dataScadenza;
                    mov.idMagazzino=carico.idMagazzino;
                    mov.qty=item.qty
                    mov.reparto=undefined;
                    mov.scaffale=undefined;
                    mov.posto=undefined;
                    mov.utenteMovimento=carico.utenteInserimento;
                    mov.dataMovimento=carico.dataOperazione;
                    mov.tipoOperazione="CARICO";

                    magazzinodao.creaMovimentoMagazzino(mov,connection,function(errMovMagazzino,movMagazzino){
                        if(errMovMagazzino) return next(['MGZ008','Errore Creazione movimento magazzino']);
                        return next(null);
                    });
                });
            });
        });
        }, function(err) {
            if (err){
                retObj.status='KO';
                retObj.code=err[0]!=undefined?err[0]:'MGZ004';
                retObj.message=err[1]!=undefined?err[1]:'Errore Carico magazzino';
                return cb(retObj,null);
            }
            retObj.status='OK';
            retObj.numeroLotto=numeroLotto;
            return cb(null,retObj);            
    });
}




/*
{  
    "lista":[  
      {  
         "articolo":"ART1",
         "descrizione":null,
         "lotto":"00009",
         "qty":1,
         "scadenza":"2018-07-28T22:00:00.000Z",
         "magazzino":"Magazzino Principale",
         "idMagazzino":1,
         "reparto":null,
         "scaffale":null,
         "posto":null,
         "selected":true,
         "qtyRelese":1
      },
      {  
         "articolo":"ART1",
         "descrizione":null,
         "lotto":"00008",
         "qty":3,
         "scadenza":"2018-07-10T22:00:00.000Z",
         "magazzino":"Magazzino Principale",
         "idMagazzino":1,
         "reparto":null,
         "scaffale":null,
         "posto":null,
         "selected":true,
         "qtyRelese":2
      },
      {  
         "articolo":"ART1",
         "descrizione":null,
         "lotto":"00007",
         "qty":2,
         "scadenza":"2018-07-03T22:00:00.000Z",
         "magazzino":"Magazzino Principale",
         "idMagazzino":1,
         "reparto":null,
         "scaffale":null,
         "posto":null,
         "selected":false,
         "qtyRelese":0
      }
   ]
}
*/
magazzinoservice.scaricoMagazzino = function(scarico, cb){
    gestionaleLogger.logger.debug('magazzinoservice- scaricoMagazzino');
    var retObj={}
    var ret;
    var movimenti = new Array();
    var mov = null;
    var elem = null;
    transaction.inTransaction(pool, function(connection, next) {
        for(var x in scarico.lista){
            mov = {};
            elem=scarico.lista[x];

            mov.lotto=elem.lotto ;
            mov.dataScadenza=elem.scadenza ;
            mov.idMagazzino=elem.idMagazzino ;
            mov.qty=elem.qtyRelese ;
            mov.reparto=elem.reparto ;
            mov.scaffale=elem.scaffale ;
            mov.posto=elem.posto ;
            mov.utenteMovimento=scarico.utenteInserimento ;
            mov.dataMovimento=dateUtils.date2str(new Date(), 'dd/MM/yyyy');
            mov.tipoOperazione="SCARICO" ;

            movimenti.push(mov);
        }

        magazzinodao.scaricoMagazzino(movimenti, connection, function(errMovMagazzino,movMagazzino){
            if(errMovMagazzino) return next(['MGZ008','Errore Creazione movimento magazzino']);
            return next(null);
        });
        
    }, function(err) {
            if (err){
                retObj.status='KO';
                retObj.code=err[0]!=undefined?err[0]:'MGZ004';
                retObj.message=err[1]!=undefined?err[1]:'Errore Carico magazzino';
                return cb(retObj,null);
            }
            retObj.status='OK';
             return cb(null,retObj);            
    });
}

/*
{  
   "scarico":{  
        "idArticolo":1,
	    "qty":3
   }
}
*/
magazzinoservice.previewScaricoMagazzino = function(scarico, cb){
    gestionaleLogger.logger.debug('magazzinoservice- previewScaricoMagazzino');
    var retObj={}
    var ret;
    var releaseQuantity=scarico.qty;
    var elem=null;
    var retVal = new Array();
    transaction.getConnection(pool,function(connection) {
        articoliservice.getDisponibilitaArticolo(scarico.idArticolo, function(errDisp, disp){
            if(errDisp){
                retObj.status='KO';
                retObj.code=err[0]!=undefined?err[0]:'MGZ005';
                retObj.message=err[1]!=undefined?err[1]:'Errore durante la lettura della disponibilità articolo';
                return cb(retObj,null);
            }
            if(!disp || disp.length == 0 ){
                retObj.status='KO';
                retObj.code=err[0]!=undefined?err[0]:'MGZ006';
                retObj.message=err[1]!=undefined?err[1]:'Non c\'è disponibilità per l\'articolo';
                return cb(retObj,null);
            }
            

            for(var i in disp.dati){
                

                elem = disp.dati[i];
                elem.selected=false;
                elem.qtyRelese=0;

                if( elem.qty > 0 && releaseQuantity!=0){
                    elem.selected=true;
                    elem.qtyRelese=(releaseQuantity >= elem.qty)?elem.qty:Number(releaseQuantity);
                    releaseQuantity-=Number(elem.qtyRelese);                   
                }
                retVal.push(elem);
            }


            retObj.status='OK';
            retObj.qtyResidua=(releaseQuantity==0)?0:releaseQuantity;
            retObj.scarico=retVal;
            return cb(null,retObj)             
        });
    });
}



module.exports = magazzinoservice;