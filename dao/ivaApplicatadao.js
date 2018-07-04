var ivaApplicatadao = require('./ivaApplicatadao')
var ivaApplicatafactory = require('../factory/ivaApplicatafactory')
var gestionaleLogger = require("../utility/gestionaleLogger");


ivaApplicatadao.getIvaApplicataById = function(cod, connection,cb){
    gestionaleLogger.logger.debug('ivaApplicatadao::getIvaApplicataById');
    ivaApplicatafactory.getIvaApplicataById(cod, connection, function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });       
};

ivaApplicatadao.getIvaApplicata = function(connection,cb){
    gestionaleLogger.logger.debug('ivaApplicatadao::getIvaApplicata');
    ivaApplicatafactory.getIvaApplicata(connection, function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });    
};

module.exports = ivaApplicatadao;