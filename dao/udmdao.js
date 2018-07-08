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
    udmfactory.getUdms(undefined, connection,function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

udmdao.getVolumeUdms = function(connection, cb){
    gestionaleLogger.logger.debug('udmdao-getVolumeUdms');
    udmfactory.getUdms("VOLUME",connection,function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

udmdao.getPesoUdms = function(connection, cb){
    gestionaleLogger.logger.debug('udmdao-getPesoUdms');
    udmfactory.getUdms("PESO",connection,function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

udmdao.getQtyScatolaUdms = function(connection, cb){
    gestionaleLogger.logger.debug('udmdao-getQtyScatolaUdms');
    udmfactory.getUdms("QTYSCATOLA",connection,function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

udmdao.getLunghezzaUdms = function(connection, cb){
    gestionaleLogger.logger.debug('udmdao-getLunghezzaUdms');
    udmfactory.getUdms("LUNGHEZZA",connection,function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

udmdao.getCapacitaUdms = function(connection, cb){
    gestionaleLogger.logger.debug('udmdao-getCapacitaUdms');
    udmfactory.getUdms("CAPACITA",connection,function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

udmdao.getDiametroUdms = function(connection, cb){
    gestionaleLogger.logger.debug('udmdao-getDiametroUdms');
    udmfactory.getUdms("DIAMETRO",connection,function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

module.exports = udmdao;