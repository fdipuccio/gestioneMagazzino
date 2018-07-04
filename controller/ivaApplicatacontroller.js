'use strict';
var ivaApplicatacontroller = require('./ivaApplicatacontroller');
var ivaApplicataservice = require('../service/ivaApplicataservice')
var gestionaleLogger = require("../utility/gestionaleLogger");


ivaApplicatacontroller.getIvaApplicataById = function(req, res, cb){
    gestionaleLogger.logger.debug('ivaApplicatacontroller- getIvaApplicataById');
    ivaApplicataservice.getIvaApplicataById(req.params.idIva, function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

ivaApplicatacontroller.getIvaApplicata = function(req, res, cb){
    gestionaleLogger.logger.debug('getIvaApplicata- controller');
    ivaApplicataservice.getIvaApplicata(function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

module.exports = ivaApplicatacontroller;
