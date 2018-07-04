var categoriaArticolifactory = require('./categoriaArticolifactory');
var pool = require('../connection/connection.js'); // db is pool
var gestionaleLogger = require("../utility/gestionaleLogger");


var QUERY_CATEGORIE = "SELECT * FROM AN_VALUTE WHERE  DELETED = 0 AND VISIBLE = 0 ";


categoriaArticolifactory.getCategoriaArticoliById = function(cod, connection, cb){
    gestionaleLogger.logger.debug('categoriaArticolifactory::getCategoriaArticoliById');
    var sql =QUERY_CATEGORIE + ' AND ID_CATEGORIA = '+connection.escape(cod);
    gestionaleLogger.logger.debug('sql',sql);
    connection.query(sql, function (err, rows) {
        if (err){
            gestionaleLogger.logger.error('categoriaArticolifactory.getCategoriaArticoliById - Internal error: ', err);
            return cb(err);
        }
        else {
            gestionaleLogger.logger.debug('rows',rows);
            return cb(null,rows)
        }
    });
};



categoriaArticolifactory.getCategoriaArticoli = function(connection, cb){
    gestionaleLogger.logger.debug('categoriaArticolifactory::getCategoriaArticoli');
    var sql =QUERY_CATEGORIE;
    gestionaleLogger.logger.debug('sql',sql);
    connection.query(sql, function (err, rows) {
        if (err){
            gestionaleLogger.logger.error('categoriaArticolifactory.getCategoriaArticoli - Internal error: ', err);
            return cb(err);
        }
        else {
            gestionaleLogger.logger.debug('rows',rows);
            return cb(null,rows)
        }
    });
};



module.exports = categoriaArticolifactory;