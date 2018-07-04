var udmdao = require('./udmdao')
var udmfactory = require('../factory/udmfactory')
var gestionaleLogger = require("../utility/gestionaleLogger");

udmdao.getUdmById = function(id,connection, cb){
    gestionaleLogger.logger.debug('udmdao-getUdmById');
    udmfactory.getUdmById(id, connection,function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

udmdao.getUdms = function(connection, cb){
    gestionaleLogger.logger.debug('udmdao-getUdms');
    udmfactory.getUdms(connection,function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

module.exports = udmdao;