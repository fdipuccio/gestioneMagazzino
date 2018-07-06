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
    var articolo = {};
	articolo.idCategoria= req.body.idCategoria;
	articolo.codiceArticolo= req.body.codiceArticolo;
	articolo.codiceBarre= req.body.codiceBarre;
	articolo.descrizione= req.body.descrizione;
	articolo.prezzo= req.body.prezzo;
	articolo.iva=req.body.iva;    
    articolo.peso= req.body.peso;
    articolo.tipologia = req.body.tipologia;
    articolo.volume=req.body.volume;    
    articolo.ultimoPrezzo=req.body.ultimoPrezzo;
    articolo.dataUltimoAcquisto=req.body.dataUltimoAcquisto;
    articolo.udm=req.body.udm;
    articolo.nddtRicevuto=req.body.nddtRicevuto;
    articolo.note=req.body.note;
    articolo.capacita=req.body.capacita;    
    articolo.valuta=req.body.valuta;    
	articoliservice.addArticolo(articolo,function(err, data){
	    return cb(err, data)
    });
}

articolicontroller.updateArticolo = function(req, res, cb){
    gestionaleLogger.logger.debug('updatearticoli- controller');
    var articolo = {};

    articolo.idCategoria= req.body.ID_CATEGORIA;
	articolo.codiceArticolo= req.body.CODICE_ARTICOLO;
	articolo.codiceBarre= req.body.CODICE_BARRE;
	articolo.descrizione= req.body.DESCRIZIONE;
	articolo.prezzo= req.body.PREZZO;
	articolo.iva=req.body.IVA;
    articolo.peso= req.body.PESO;
    articolo.tipologia= req.body.TIPOLOGIA;
    articolo.volume=req.body.VOLUME;
    articolo.ultimoPrezzo=req.body.ULTIMO_PREZZO;
    articolo.dataUltimoAcquisto=req.body.DATA_ULTIMO_ACQUIST;
    articolo.udm=req.body.UDM;
    articolo.nddtRicevuto=req.body.NDDT_RICEVUTO;
    articolo.note=req.body.NOTE;
    articolo.capacita=req.body.CAPACITA;
    articolo.idArticolo=req.params.idArticolo;
    articolo.valuta=req.body.VALUTA;   
    articoliservice.updateArticolo(articolo,function(err,data){
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
