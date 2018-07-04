var comunidao = require('./comunidao')
var comunifactory = require('../factory/comunifactory')
var gestionaleLogger = require("../utility/gestionaleLogger");

comunidao.getComuneByCodIstat = function(id,connection, cb){
    gestionaleLogger.logger.debug('comunidao-getComuneByCodIstat');
    comunifactory.getComuneByCodIstat(id, connection, function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}


comunidao.getCapByComune = function(comune,connection, cb){
    gestionaleLogger.logger.debug('comunidao-getCapByComune');
    comunifactory.getCapByComune(comune, connection, function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}



comunidao.getComuniPagedSearch= function(filter,connection, cb){
    gestionaleLogger.logger.debug('comunidao-getComuniPagedSearch');
    comunifactory.getComuniPagedSearch(filter,connection,function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

comunidao.getComuni= function(filter,connection, cb){
    gestionaleLogger.logger.debug('comunidao-readComuni');
    comunifactory.getComuni(filter,connection,function(err, data){ // gestire l'eventuale filtro
        if (err) return cb(err);
        return cb(null,data)
    });
}

module.exports = comunidao;