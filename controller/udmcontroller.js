'use strict';
var udmcontroller = require('./udmcontroller');
var udmservice = require('../service/udmservice')
var gestionaleLogger = require("../utility/gestionaleLogger");


udmcontroller.getUdmById = function(req, res, cb){
    gestionaleLogger.logger.debug('udmcontroller- getUdmById');
    udmservice.getUdmById(req.params.idUdm, function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

udmcontroller.getUdms = function(req, res, cb){
    gestionaleLogger.logger.debug('udmcontroller- getUdms');
    udmservice.getUdms(function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

udmcontroller.getVolumeUdms = function(req, res, cb){
    gestionaleLogger.logger.debug('udmcontroller- getVolumeUdms');
    udmservice.getVolumeUdms(function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

udmcontroller.getPesoUdms = function(req, res, cb){
    gestionaleLogger.logger.debug('udmcontroller- getPesoUdms');
    udmservice.getPesoUdms(function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

udmcontroller.getQtyScatolaUdms = function(req, res, cb){
    gestionaleLogger.logger.debug('udmcontroller- getQtyScatolaUdms');
    udmservice.getQtyScatolaUdms(function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

udmcontroller.getLunghezzaUdms = function(req, res, cb){
    gestionaleLogger.logger.debug('udmcontroller- getLunghezzaUdms');
    udmservice.getLunghezzaUdms(function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

udmcontroller.getCapacitaUdms = function(req, res, cb){
    gestionaleLogger.logger.debug('udmcontroller- getCapacitaUdms');
    udmservice.getCapacitaUdms(function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

udmcontroller.getDiametroUdms = function(req, res, cb){
    gestionaleLogger.logger.debug('udmcontroller- getDiametroUdms');
    udmservice.getDiametroUdms(function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

module.exports = udmcontroller;
