'use strict';
var magazzinocontroller = require('./magazzinocontroller');
var magazzinoservice = require('../service/magazzinoservice')
var gestionaleLogger = require("../utility/gestionaleLogger");

magazzinocontroller.getMagazzini = function(req, res, cb){
    gestionaleLogger.logger.debug('magazzinocontroller- getMagazzini');
    magazzinoservice.getMagazzini(function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

magazzinocontroller.caricoMagazzino = function(req, res, cb){
    gestionaleLogger.logger.debug('magazzinocontroller- caricoMagazzino');
    magazzinoservice.caricoMagazzino(req.body.carico, function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}


magazzinocontroller.scaricoMagazzino = function(req, res, cb){
    gestionaleLogger.logger.debug('magazzinocontroller- scaricoMagazzino');
    magazzinoservice.scaricoMagazzino(req.body.scarico, function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}


magazzinocontroller.getMagazzinoById = function(req, res, cb){
    gestionaleLogger.logger.debug('magazzinocontroller- getMagazzinoById');
    magazzinoservice.getMagazzinoById(req.params.idMagazzino, function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}


/**
 * {
 *      "magazzino" : {
 *          "nome":"", 
 *          "indirizzo":"", 
 *          "idComune", 111,
 *          "note": "bbbb"
 *      }
 * }
 */
magazzinocontroller.addMagazzino = function(req, res, cb){
    gestionaleLogger.logger.debug('magazzinocontroller- addMagazzino');
    magazzinoservice.addMagazzino(req.body.magazzino, function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

magazzinocontroller.putMagazzino = function(req, res, cb){
    gestionaleLogger.logger.debug('magazzinocontroller- putMagazzino');
    magazzinoservice.putMagazzino(req.params.idMagazzino,req.body.magazzino, function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

magazzinocontroller.deleteMagazzino = function(req, res, cb){
    gestionaleLogger.logger.debug('magazzinocontroller- deleteMagazzino');
    magazzinoservice.deleteMagazzino(req.params.idMagazzino, function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}


module.exports = magazzinocontroller;
