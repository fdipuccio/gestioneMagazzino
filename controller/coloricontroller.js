'use strict';
var coloricontroller = require('./coloricontroller');
var coloriservice = require('../service/coloriservice')
var gestionaleLogger = require("../utility/gestionaleLogger");



coloricontroller.getAll= function(req, res, cb){
    gestionaleLogger.logger.debug('coloricontroller-getAll');
	coloriservice.getAll(function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

coloricontroller.getById = function(req, res, cb){
    gestionaleLogger.logger.debug('coloricontroller-getById');
	coloriservice.getById(req.params.idColore, function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

coloricontroller.deleteById = function(req, res, cb){
    gestionaleLogger.logger.debug('coloricontroller-deleteById');
	coloriservice.deleteById(req.params.idColore, function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

coloricontroller.postColore = function(req, res, cb){
    gestionaleLogger.logger.debug('coloricontroller-postColore');
	coloriservice.postColore(req.body.colore, function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

coloricontroller.putColore = function(req, res, cb){
    gestionaleLogger.logger.debug('coloricontroller-putColore');
	coloriservice.putColore(req.params.idColore, req.body.colore, function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    })
}


module.exports = coloricontroller;
