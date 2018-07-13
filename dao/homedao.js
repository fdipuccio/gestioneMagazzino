var homedao = require('./homedao')
var homefactory = require('../factory/homefactory')
var gestionaleLogger = require("../utility/gestionaleLogger");


homedao.getDatiAlertScadenza = function(connection, cb){
    gestionaleLogger.logger.debug('homedao-getDatiAlertScadenza');
    homefactory.getDatiAlertScadenza(connection, function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

homedao.getDatiAlertQuantita = function(connection, cb){
    gestionaleLogger.logger.debug('homedao-getDatiAlertQuantita');
    homefactory.getDatiAlertQuantita(connection, function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}


module.exports = homedao;