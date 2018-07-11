'use strict';
var categoriearticolocontroller = require('./categoriearticolocontroller');
var categoriearticoloservice = require('../service/categoriearticoloservice')
var gestionaleLogger = require("../utility/gestionaleLogger");



categoriearticolocontroller.getAll= function(req, res, cb){
    gestionaleLogger.logger.debug('categoriearticolocontroller-getAll');
	categoriearticoloservice.getAll(function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

categoriearticolocontroller.getById = function(req, res, cb){
    gestionaleLogger.logger.debug('categoriearticolocontroller-getById');
	categoriearticoloservice.getById(req.params.idCategoria, function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

categoriearticolocontroller.deleteById = function(req, res, cb){
    gestionaleLogger.logger.debug('categoriearticolocontroller-deleteById');
	categoriearticoloservice.deleteById(req.params.idCategoria, function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

categoriearticolocontroller.postCategoria = function(req, res, cb){
    gestionaleLogger.logger.debug('categoriearticolocontroller-postCategoria');
	categoriearticoloservice.postCategoria(req.body.categoria, function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

categoriearticolocontroller.putCategoria = function(req, res, cb){
    gestionaleLogger.logger.debug('categoriearticolocontroller-putCategoria');
	categoriearticoloservice.putCategoria(req.params.idCategoria, req.body.categoria, function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    })
}


module.exports = categoriearticolocontroller;
