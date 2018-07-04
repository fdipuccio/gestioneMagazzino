var configservice = require('./configservice')
var configdao = require('../dao/configdao')
var gestionaleLogger = require("../utility/gestionaleLogger");
var pool = require('../connection/connection.js'); // db is pool
var transaction = require('../connection/transactionUtils.js'); // transaction management


configservice.getconfigSection = function(section,cb){
    gestionaleLogger.logger.debug('configservice- getconfigSection');
    transaction.getConnection(pool,function(connection) {
        configdao.getconfigSection(section,connection, function(err, data){
            if (err) return cb(err);
            var configuration = {};
            configuration.properties = new Array();
            for(idx in data){
                configuration.properties.push({name: data[idx].PROP_NAME , value: data[idx].VAL});
            }
            return cb(null,configuration);
        });
    });    
}

configservice.getconfigProperty = function(section, propName,connection, cb){
    gestionaleLogger.logger.debug('configservice- getconfigProperty');
    configdao.getconfigProperty(section, propName, connection, function(err, data){
        if (err) return cb(err);
        return cb(null,data);
    });
}    


module.exports = configservice;