var homefactory = require('./homefactory');
var pool = require('../connection/connection.js'); // db is pool
var gestionaleLogger = require("../utility/gestionaleLogger");


homefactory.getDatiAlertScadenza = function(connection, cb){
    gestionaleLogger.logger.debug('homefactory::getDatiAlertScadenza');
    var sql =" SELECT ID_ARTICOLO, CODICE_ARTICOLO, DESCRIZIONE, DATA_SCADENZA, QTY " +
             " FROM VW_ALERT_ARTICOLI V " +
             " WHERE ALERT_SCA = 'TRUE'";
    gestionaleLogger.logger.debug('sql',sql);
    connection.query(sql, function (err, rows) {
        if (err){
            gestionaleLogger.logger.error('homefactory.getDatiAlertScadenza - Internal error: ', err);
            return cb(err);
        }
        else {
            return cb(null,rows)
        }
    });
};

homefactory.getDatiAlertQuantita = function(connection, cb){
    gestionaleLogger.logger.debug('homefactory::getDatiAlertQuantita');
    var sql =" SELECT ID_ARTICOLO, CODICE_ARTICOLO, DESCRIZIONE, QTY " +
             " FROM VW_ALERT_ARTICOLI V " +
             " WHERE ALERT_QTY = 'TRUE'";
    gestionaleLogger.logger.debug('sql',sql);
    connection.query(sql, function (err, rows) {
        if (err){
            gestionaleLogger.logger.error('homefactory.getDatiAlertQuantita - Internal error: ', err);
            return cb(err);
        }
        else {
            return cb(null,rows)
        }
    });
};


module.exports = homefactory;