'use strict';
var fornitoricontroller = require('./fornitoricontroller');
var fornitoriservice = require('../service/fornitoriservice')
var gestionaleLogger = require("../utility/gestionaleLogger");


fornitoricontroller.getSupplierById = function (req, res, cb) {
    gestionaleLogger.logger.debug('fornitoricontroller- getSupplierById');
    fornitoriservice.getSupplierById(req.params.idFornitore, function (err, data) {
        if (err) return cb(err);
        return cb(null, data)
    });
}

fornitoricontroller.addSupplier = function (req, res, cb) {
    gestionaleLogger.logger.debug('addSupplier- controller');
    fornitoriservice.addSupplier(req.body.fornitore, function (err, data) {
        return cb(err, data)
    });
}

fornitoricontroller.updateSupplier = function (req, res, cb) {
    gestionaleLogger.logger.debug('updateSupplier- controller');
    fornitoriservice.updateSupplier(req.params.idFornitore, req.body.fornitore, function (err,data) {
        return cb(err,data)
    });
}

fornitoricontroller.advancedSearch = function(req, res, cb){
    gestionaleLogger.logger.debug('advancedSearch- controller');
   fornitoriservice.advancedSearch(req.body.filter, function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });

}

fornitoricontroller.deleteSupplier = function (req, res, cb) {
    gestionaleLogger.logger.debug('deleteSupplier- controller');
    fornitoriservice.deleteSupplier(req.params.idFornitore, function (err, data) {
        return cb(err, data)
    });
}


module.exports = fornitoricontroller;
