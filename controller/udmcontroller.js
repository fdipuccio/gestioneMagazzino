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

module.exports = udmcontroller;
