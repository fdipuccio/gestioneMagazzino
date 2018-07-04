var configdao = require('./configdao')
var configfactory = require('../factory/configfactory')
var gestionaleLogger = require("../utility/gestionaleLogger");


configdao.getconfigSection = function(section, connection, cb){
    gestionaleLogger.logger.debug('configdao-getconfigSection');
    configfactory.getconfigSection(section, connection,function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}


configdao.getconfigProperty = function(section,propName, connection, cb){
    gestionaleLogger.logger.debug('configdao-getconfigProperty');
    configfactory.getconfigProperty(section,propName, connection,function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

module.exports = configdao;