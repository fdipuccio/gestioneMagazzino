var magazzinofactory = require('./magazzinofactory');
var pool = require('../connection/connection.js'); // db is pool
var gestionaleLogger = require("../utility/gestionaleLogger");


magazzinofactory.getMagazzini = function(connection, cb){
    gestionaleLogger.logger.debug('magazzinofactory::getMagazzini');
    var sql =" SELECT M.ID_MAGAZZINO, M.NOME_MAGAZZINO, M.INDIRIZZO, C.NOME COMUNE, CONVERT(M.NOTE USING UTF8) AS NOTE, C.COD_PROVINCIA, C.COD_REGIONE, C.CAP " +	
            " FROM AN_MAGAZZINI M JOIN AN_COMUNI C ON M.IDCOMUNE = C.IDCOMUNE " +
            " WHERE DELETED = 0";
    gestionaleLogger.logger.debug('sql',sql);
    connection.query(sql, function (err, rows) {
        if (err){
            gestionaleLogger.logger.error('magazzinofactory.getMagazzini - Internal error: ', err);
            return cb(err);
        }
        else {
            return cb(null,rows)
        }
    });
}



magazzinofactory.generaNumeroLotto = function(idMagazzino, connection, cb){
    gestionaleLogger.logger.debug('magazzinofactory::caricoMagazzino');
    var sql ="SELECT F_GET_NEXT_LOTTO("+connection.escape(idMagazzino)+") AS NLOTTO";
    gestionaleLogger.logger.debug('sql',sql);
    connection.query(sql, function (err, rows) {
        if (err){
            gestionaleLogger.logger.error('magazzinofactory.caricoMagazzino - Internal error: ', err);
            return cb(err);
        }
        else {
            return cb(null,rows[0].NLOTTO)
        }
    });
}

magazzinofactory.addLotto = function(lotto, connection, cb){
    gestionaleLogger.logger.debug('magazzinofactory::addLotto');
    var sql ="INSERT INTO LG_LOTTI_MAGAZZINO(NLOTTO, NOTE,DATA_CREAZIONE, UTENTE_INS, QTY, PREZZO_ACQUISTO, ID_ARTICOLO, ID_FORNITORE)" + 
             " VALUES(?,?,STR_TO_DATE(?,'%e/%c/%Y %T'),?,?,?,?,?)";
    gestionaleLogger.logger.debug('sql',sql);
    connection.query(sql,[lotto.numero,lotto.note,lotto.dataCreazione,lotto.utenteInserimento,lotto.qty,lotto.prezzoAcquisto,lotto.idArticolo,lotto.idFornitore], function (err, results) {
        if (err){
            gestionaleLogger.logger.error('magazzinofactory.addLotto - Internal error: ', err);
            return cb(err);
        }
        else {
            return cb(null,results.insertId)
        }
    });
}


magazzinofactory.creaMovimentoMagazzino = function(mov, connection, cb){
    gestionaleLogger.logger.debug('magazzinofactory::creaMovimentoMagazzino');
    var sql ="INSERT INTO LG_MOVIMENTI_MAGAZZINO(NLOTTO, " +
                                               " DATA_SCADENZA, " +
                                               " ID_MAGAZZINO, " +
                                               " QTY, " +
                                               " REPARTO, " +
                                               " SCAFFALE, " +
                                               " POSTO, " +
                                               " UTENTE_MOVIMENTO, " +
                                               " DATA_MOVIMENTO, " +
                                               " TIPO_OPERAZIONE)" + 
             " VALUES(?,STR_TO_DATE(?,'%e/%c/%Y %T'),?,?,?,?,?,?,STR_TO_DATE(?,'%e/%c/%Y %T'),?)";
    gestionaleLogger.logger.debug('sql',sql);
    connection.query(sql,[mov.lotto,mov.dataScadenza,mov.idMagazzino,mov.qty,mov.reparto,mov.scaffale,mov.posto,mov.utenteMovimento,mov.dataMovimento,mov.tipoOperazione], function (err, results) {
        if (err){
            gestionaleLogger.logger.error('magazzinofactory.creaMovimentoMagazzino - Internal error: ', err);
            return cb(err);
        }
        else {
            return cb(null,results.insertId)
        }
    });
}

















magazzinofactory.getMagazzinoById = function(idMagazzino,connection, cb){
    gestionaleLogger.logger.debug('magazzinofactory::getMagazzinoById');
    var sql =" SELECT M.ID_MAGAZZINO, M.NOME_MAGAZZINO, M.INDIRIZZO, C.NOME COMUNE, CONVERT(M.NOTE USING UTF8) AS NOTE, C.COD_PROVINCIA, C.COD_REGIONE, C.CAP " +	
            " FROM AN_MAGAZZINI M JOIN AN_COMUNI C ON M.IDCOMUNE = C.IDCOMUNE " +
            " WHERE DELETED = 0 AND ID_MAGAZZINO = " + connection.escape(idMagazzino);
    gestionaleLogger.logger.debug('sql',sql);
    connection.query(sql, function (err, rows) {
        if (err){
            gestionaleLogger.logger.error('magazzinofactory.getMagazzinoById - Internal error: ', err);
            return cb(err);
        }
        else {
            return cb(null,rows)
        }
    });
}

magazzinofactory.addMagazzino = function(magazzino,connection, cb){
    gestionaleLogger.logger.debug('magazzinofactory::addMagazzino');
    var sql ="INSERT INTO AN_MAGAZZINI (NOME_MAGAZZINO, INDIRIZZO, IDCOMUNE, NOTE)VALUES(?,?,?,?) ";
    gestionaleLogger.logger.debug('sql',sql);
    connection.query(sql, [magazzino.nome, magazzino.indirizzo, magazzino.idComune, magazzino.note], function (err, rows) {
        if (err){
            gestionaleLogger.logger.error('magazzinofactory.addMagazzino - Internal error: ', err);
            return cb(err);
        }
        else {
            return cb(null,rows)
        }
    });
}

magazzinofactory.putMagazzino = function(idMagazzino, magazzino,connection, cb){
    gestionaleLogger.logger.debug('magazzinofactory-putMagazzino');
    var updtStr="UPDATE AN_MAGAZZINI SET ";
    updtStr+=(magazzino.nome!=undefined)?" NOME_MAGAZZINO ="+connection.escape(magazzino.nome)+",":"";
    updtStr+=(magazzino.indirizzo!=undefined)?" INDIRIZZO ="+connection.escape(magazzino.indirizzo)+",":"";
    updtStr+=(magazzino.idComune!=undefined)?" IDCOMUNE ="+connection.escape(magazzino.idComune)+",":"";
    updtStr+=(magazzino.note!=undefined || magazzino.note==null)?" NOTE ="+connection.escape(magazzino.note)+",":"";
    updtStr= updtStr.substring(0, updtStr.length - 1);// elimino l'ultima vigola :)
    updtStr+= " WHERE DELETED = 0 AND ID_MAGAZZINO ="+connection.escape(idMagazzino);
    gestionaleLogger.logger.debug('updtStr',updtStr);

    connection.query(updtStr,function(error, results) {
        if (error) {
            gestionaleLogger.logger.error('magazzinofactory.putMagazzino - Internal error: ', error);
            return cb('KO', null);
        }else {
            gestionaleLogger.logger.debug("Update done");
            return cb(null, 'OK')
        }
    });
}

magazzinofactory.deleteMagazzino = function(idMagazzino,connection, cb){
    gestionaleLogger.logger.debug('magazzinofactory::deleteMagazzino');
    var sql ="UPDATE AN_MAGAZZINI SET DELETED = 1, DELETE_DATE=CURRENT_TIMESTAMP WHERE ID_MAGAZZINO = " + connection.escape(idMagazzino);
    gestionaleLogger.logger.debug('sql',sql);
    connection.query(sql, function (err, rows) {
        if (err){
            gestionaleLogger.logger.error('magazzinofactory.deleteMagazzino - Internal error: ', err);
            return cb(err);
        }
        else {
            return cb(null,rows)
        }
    });
}

module.exports = magazzinofactory;