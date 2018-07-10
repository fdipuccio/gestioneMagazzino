'use strict';
var magazzinocontroller = require('./magazzinocontroller');
var magazzinoservice = require('../service/magazzinoservice')
var gestionaleLogger = require("../utility/gestionaleLogger");

magazzinocontroller.getMagazzini = function(req, res, cb){
    gestionaleLogger.logger.debug('getMagazzino- getMagazzini');
    magazzinoservice.getMagazzini(function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

magazzinocontroller.getMagazzinoById = function(req, res, cb){
    gestionaleLogger.logger.debug('getMagazzino- getMagazzinoById');
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
    gestionaleLogger.logger.debug('getMagazzino- addMagazzino');
    magazzinoservice.addMagazzino(req.body.magazzino, function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

magazzinocontroller.putMagazzino = function(req, res, cb){
    gestionaleLogger.logger.debug('getMagazzino- putMagazzino');
    magazzinoservice.putMagazzino(req.params.idMagazzino,req.body.magazzino, function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

magazzinocontroller.deleteMagazzino = function(req, res, cb){
    gestionaleLogger.logger.debug('getMagazzino- deleteMagazzino');
    magazzinoservice.deleteMagazzino(req.params.idMagazzino, function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}


module.exports = magazzinocontroller;
