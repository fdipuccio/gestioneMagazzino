'use strict';
var articolicontroller = require('./articolicontroller');
var articoliservice = require('../service/articoliservice')
var gestionaleLogger = require("../utility/gestionaleLogger");


articolicontroller.searchArticoli = function(req, res, cb){
    gestionaleLogger.logger.debug('articolicontroller- searchArticoli');
    var filter = req.body.filter;
    articoliservice.searchArticoli(filter, function(err, data){
          if (err) return cb(err);
			return cb(null,data)
    });
}


articolicontroller.getAndamentoPrezzo = function(req, res, cb){
    gestionaleLogger.logger.debug('articolicontroller- getAndamentoPrezzo');
    var idArticolo=req.body.input.idArticolo;
    var startDate=req.body.input.startDate;
    var endDate = req.body.input.endDate;
    articoliservice.getAndamentoPrezzo(idArticolo, startDate, endDate, function(err, data){
          if (err) return cb(err);
			return cb(null,data)
    });
}

articolicontroller.getGraficoAcArticolo = function(req, res, cb){
    gestionaleLogger.logger.debug('articolicontroller- getGraficoAcArticolo');
    articoliservice.getGraficoAcArticolo(req.params.idArticolo, function(err, data){
          if (err) return cb(err);
			return cb(null,data)
    });
}


articolicontroller.getDisponibilitaArticolo = function(req, res, cb){
    gestionaleLogger.logger.debug('articolicontroller- getDisponibilitaArticolo');
    var idArticolo=req.params.idArticolo;
    articoliservice.getDisponibilitaArticolo(idArticolo, function(err, data){
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

articolicontroller.addArticolo = function(req, res, cb){
    gestionaleLogger.logger.debug('articoli- controller addArticolo');  
	articoliservice.addArticolo(req.body.articolo,function(err, data){
	    return cb(err, data)
    });
}

articolicontroller.updateArticolo = function(req, res, cb){
    gestionaleLogger.logger.debug('updatearticoli- controller');
    articoliservice.updateArticolo(req.body.articolo, req.params.idArticolo, function(err,data){
	    return cb(err,data)
    });
}

articolicontroller.deleteArticolo = function(req, res, cb){
	gestionaleLogger.logger.debug('deletearticoli- controller');
    articoliservice.deleteArticolo(req.params.idArticolo,function(err, data){
        return cb(err, data)
    });
}

articolicontroller.generateBarcode = function(req, res, cb){
	gestionaleLogger.logger.debug('deletearticoli- controller');
    articoliservice.generateBarcode(function(err, data){
        return cb(err, data)
    });
}

module.exports = articolicontroller;
