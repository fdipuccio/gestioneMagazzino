'use strict';
var articolicontroller = require('./articolicontroller');
var articoliservice = require('../service/articoliservice')
var gestionaleLogger = require("../utility/gestionaleLogger");

articolicontroller.readArticoli = function(req, res, cb){
    gestionaleLogger.logger.debug('articolicontroller- readArticoli');
    articoliservice.readArticoli(function(err, data){
          if (err) return cb(err);
			return cb(null,data)
    });
}

articolicontroller.searchArticoli = function(req, res, cb){
    gestionaleLogger.logger.debug('articolicontroller- searchArticoli');
    var filter = req.body.filter.searchkey;
    articoliservice.searchArticoli(filter, function(err, data){
          if (err) return cb(err);
			return cb(null,data)
    });
}


articolicontroller.getArticoloById = function(req, res, cb){
    gestionaleLogger.logger.debug('articolicontroller- getArticoloById');
	var  idArticolo=req.params.idArticolo;
    articoliservice.getArticoloById(idArticolo, function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

articolicontroller.readArticoliCategories= function(req, res, cb){
    gestionaleLogger.logger.debug('articolicontroller-readArticoliCategories');
	articoliservice.readArticoliCategories(function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

articolicontroller.readArticoliByCategory = function(req, res, cb){
    gestionaleLogger.logger.debug('articolicontroller-readArticoliByCategory');
	articoliservice.readArticoliByCategory(req.params.idCategory,function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

articolicontroller.getArticoloByCode = function(req, res, cb){
    gestionaleLogger.logger.debug('articolicontroller- getArticoloByCode');
	var  codeArticolo=req.params.codeArticolo;
    articoliservice.getArticoloByCode(codeArticolo, function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

articolicontroller.advancedsearch = function(req, res, cb){
    gestionaleLogger.logger.debug('articoli- controller advancedsearch');
    var obj = req.body.filter;
    articoliservice.advancedsearch(obj,req.body.ivaProdotto, req.body.ivaServizio, function(err, data){
        return cb(data)
    });
    
}

articolicontroller.addArticolo = function(req, res, cb){
	gestionaleLogger.logger.debug('articoli- controller addArticolo');
	var idCategoria= req.body.idCategoria;
	var codiceArticolo= req.body.codiceArticolo;
	var codiceBarre= req.body.codiceBarre;
	var descrizione= req.body.descrizione;
	var prezzo= req.body.prezzo;
	var iva=req.body.iva;    
    var peso= req.body.peso;
    var tipologia = req.body.tipologia;
    var volume=req.body.volume;    
    var ultimoPrezzo=req.body.ultimoPrezzo;
    var dataUltimoAcquisto=req.body.dataUltimoAcquisto;
    var udm=req.body.udm;
    var nddtRicevuto=req.body.nddtRicevuto;
    var note=req.body.note;
    var capacita=req.body.capacita;    
    var valuta=req.body.valuta;    
	articoliservice.addArticolo(idCategoria,codiceArticolo,codiceBarre,descrizione,prezzo,iva,peso,tipologia,volume,ultimoPrezzo,dataUltimoAcquisto,udm,nddtRicevuto,note,capacita,valuta,function(err, data){
	    return cb(err, data)
    });
}

articolicontroller.updateArticolo = function(req, res, cb){
	gestionaleLogger.logger.debug('updatearticoli- controller');
    var idCategoria= req.body.ID_CATEGORIA;
	var codiceArticolo= req.body.CODICE_ARTICOLO;
	var codiceBarre= req.body.CODICE_BARRE;
	var descrizione= req.body.DESCRIZIONE;
	var prezzo= req.body.PREZZO;
	var iva=req.body.IVA;
    var peso= req.body.PESO;
    var tipologia= req.body.TIPOLOGIA;
    var volume=req.body.VOLUME;
    var ultimoPrezzo=req.body.ULTIMO_PREZZO;
    var dataUltimoAcquisto=req.body.DATA_ULTIMO_ACQUIST;
    var udm=req.body.UDM;
    var nddtRicevuto=req.body.NDDT_RICEVUTO;
    var note=req.body.NOTE;
    var capacita=req.body.CAPACITA;
    var idArticolo=req.params.idArticolo;
    var valuta=req.body.VALUTA;   
    articoliservice.updateArticolo(idCategoria,capacita,codiceArticolo,codiceBarre,descrizione,prezzo,iva,peso,tipologia,volume,ultimoPrezzo,dataUltimoAcquisto,udm,nddtRicevuto,note,idArticolo,valuta,function(err,data){
	    return cb(err,data)
    });
}

articolicontroller.deleteArticolo = function(req, res, cb){
	gestionaleLogger.logger.debug('deletearticoli- controller');
    articoliservice.deleteArticolo(req.params.idArticolo,function(data){
        return cb(data)
    });
}

module.exports = articolicontroller;
