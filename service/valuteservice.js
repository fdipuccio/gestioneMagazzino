var valuteservice = require('./valuteservice')
var valutedao = require('../dao/valutedao')
var gestionaleLogger = require("../utility/gestionaleLogger");
var pool = require('../connection/connection.js'); // db is pool
var transaction = require('../connection/transactionUtils.js'); // transaction management


valuteservice.getValute = function(cb){
    gestionaleLogger.logger.debug('valuteservice- getValute');
    transaction.getConnection(pool,function(connection) {
        valutedao.getValute(connection, function(err, data){
            if (err) return cb(err);
            return cb(null,data)
        });
    });    
}

module.exports = valuteservice;