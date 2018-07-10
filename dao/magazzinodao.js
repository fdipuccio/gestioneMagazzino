var magazzinodao = require('./magazzinodao')
var magazzinofactory = require('../factory/magazzinofactory')
var gestionaleLogger = require("../utility/gestionaleLogger");


magazzinodao.getMagazzini = function(connection, cb){
    gestionaleLogger.logger.debug('magazzinodao-getMagazzini');
    magazzinofactory.getMagazzini(connection, function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

magazzinodao.getMagazzinoById = function(idMagazzino, connection, cb){
    gestionaleLogger.logger.debug('magazzinodao-getMagazzinoById');
    magazzinofactory.getMagazzinoById(idMagazzino,connection, function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

magazzinodao.addMagazzino = function(magazzino,connection,cb){
    gestionaleLogger.logger.debug('magazzinodao-addMagazzino');
    magazzinofactory.addMagazzino(magazzino,connection, function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

magazzinodao.putMagazzino = function(idMagazzino, magazzino,connection,cb){
    gestionaleLogger.logger.debug('magazzinodao-putMagazzino');
    magazzinofactory.putMagazzino(idMagazzino, magazzino,connection, function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

magazzinodao.deleteMagazzino = function(idMagazzino,connection,cb){
    gestionaleLogger.logger.debug('magazzinodao-deleteMagazzino');
    magazzinofactory.deleteMagazzino(idMagazzino,connection, function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}
    

module.exports = magazzinodao;