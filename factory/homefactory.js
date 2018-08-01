var homefactory = require('./homefactory');
var pool = require('../connection/connection.js'); // db is pool
var gestionaleLogger = require("../utility/gestionaleLogger");


homefactory.getDatiAlertScadenza = function(connection, cb){
    gestionaleLogger.logger.debug('homefactory::getDatiAlertScadenza');
    var sql =" SELECT  " +
            "     A.ID_ARTICOLO,  " +
            "     A.CODICE_ARTICOLO,  " +
            "     A.DESCRIZIONE,  " +
            "     Q.SCADENZA, " + 
            "     SUM(Q.QTY) QTY,  " +
            "     A.TIMER_SCADENZA_DD  " +
            "     FROM  " +
            "     LG_QTY_ARTICOLO Q  " +
            "         JOIN  " +
            "     AN_ARTICOLI A ON A.ID_ARTICOLO = Q.ID_ARTICOLO  " +
            " WHERE 1=1  " +
            "     AND Q.QTY > 0   " +
            "     AND A.DELETED = 0  " +
            "     AND (DATE_SUB(Q.SCADENZA, INTERVAL A.TIMER_SCADENZA_DD DAY) <= now())  " +
            " GROUP BY Q.SCADENZA  ";
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
    var sql =" SELECT A.ID_ARTICOLO, A.CODICE_ARTICOLO, A.DESCRIZIONE,  sum(Q.QTY) QTY , A.MINIMO_MAGAZZINO " +
            " FROM LG_QTY_ARTICOLO Q " +
            "  JOIN AN_ARTICOLI A ON A.ID_ARTICOLO=Q.ID_ARTICOLO " +
            "  WHERE 1=1 " + 
            "   AND Q.QTY > 0 " +
            "   AND A.DELETED = 0 " +
            "  group by id_articolo " +
            "  having (A.MINIMO_MAGAZZINO >= sum(Q.QTY));";
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