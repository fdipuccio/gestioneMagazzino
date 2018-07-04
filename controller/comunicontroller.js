'use strict';
var comunicontroller = require('./comunicontroller');
var comuniservice = require('../service/comuniservice')
var gestionaleLogger = require("../utility/gestionaleLogger");


comunicontroller.getComuneByCodIstat = function(req, res, cb){
    gestionaleLogger.logger.debug('comunicontroller- getComuneByCodIstat');
    comuniservice.getComuneByCodIstat(req.params.codIstat, function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

comunicontroller.getCapByComune = function(req, res, cb){
    gestionaleLogger.logger.debug('comunicontroller- getComuneByCodIstat');
    comuniservice.getCapByComune(req.params.comune, function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}



comunicontroller.getComuniPagedSearch = function(req, res, cb){
    gestionaleLogger.logger.debug('getComuni- controller');
    var filter={};
    filter.key=req.params.filter;
    filter.pageSize=req.params.top;
    filter.pageNum=req.query.pageNum;
    comuniservice.getComuniPagedSearch(filter, function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

comunicontroller.getComuni = function(req, res, cb){
    gestionaleLogger.logger.debug('getComuni- controller');
    var filter={};
    //vanno gestiti i filtri sui comuni? Tipo autocomplete ???? 
    comuniservice.getComuni(filter, function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

module.exports = comunicontroller;
