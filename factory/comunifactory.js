var comunifactory = require('./comunifactory');
var pool = require('../connection/connection.js'); // db is pool
var gestionaleLogger = require("../utility/gestionaleLogger");


comunifactory.getComuneByCodIstat = function(codIstat,connection, cb){
    gestionaleLogger.logger.debug('comunifactory::getcomuniById');
    var sql ="SELECT IDCOMUNE, COD_ISTAT,NOME COMUNE ,COD_PROVINCIA,COD_REGIONE,CAP,CODFISCO, CONCAT(NOME,' - ',CAP) NOME  FROM an_comuni WHERE  COD_ISTAT = "+connection.escape(codIstat);
    gestionaleLogger.logger.debug('sql',sql);
    connection.query(sql, function (err, rows) {
        if (err){
            gestionaleLogger.logger.error('comunifactory.getComuneByCodIstat - Internal error: ', err);
            return cb(err);
        }
        else {
            return cb(null,rows)
        }
    });
};

comunifactory.getCapByComune = function(comune,connection, cb){
    gestionaleLogger.logger.debug('comunifactory::getCapByComune');
    var sql ="SELECT CAP FROM an_comuni WHERE  UPPER(nome) = UPPER("+connection.escape(comune)+")";
    gestionaleLogger.logger.debug('sql',sql);
    connection.query(sql, function (err, rows) {
        if (err){
            gestionaleLogger.logger.error('comunifactory.getCapByComune - Internal error: ', err);
            return cb(err);
        }
        else {
            return cb(null,rows)
        }
    });
};



comunifactory.getComuniPagedSearch = function(filter, connection, cb){
    gestionaleLogger.logger.debug('comunifactory::getComuniPagedSearch');
    var sql ="SELECT IDCOMUNE,COD_ISTAT,NOME COMUNE ,COD_PROVINCIA,COD_REGIONE,CAP,CODFISCO, CONCAT(NOME,' - ',CAP) NOME FROM AN_comuni WHERE 1=1";
    var pSize = 1;
    var offset = 0;
    
    if(filter.key!=undefined){
        sql += " AND UPPER(CONCAT(NOME,' - ',CAP)) LIKE UPPER('" + filter.key + "%') ";
    }
    
    if(filter.pageSize!=undefined){
        pSize = filter.pageSize;

        if(filter.pageNum!=undefined){         
            offset=pSize*filter.pageNum;    
        }
        
        sql += " LIMIT " + offset + "," + pSize;
    }

    sql +=";";
        
    gestionaleLogger.logger.debug('sql',sql);
    connection.query(sql, function (err, rows) {
        if (err){
            gestionaleLogger.logger.error('comunifactory.getComuniPagedSearch - Internal error: ', err);
            return cb(err);
        }
        else {
            return cb(null,rows)
        }
    });
};

comunifactory.getComuni = function(filter, connection, cb){
    gestionaleLogger.logger.debug('comunifactory::getComuni');
    var sql ="SELECT COD_ISTAT,NOME COMUNE ,COD_PROVINCIA,COD_REGIONE,CAP,CODFISCO, CONCAT(NOME,' - ',CAP) NOME  FROM AN_comuni limit 10";
    //gestire i filtri ???
    gestionaleLogger.logger.debug('sql',sql);
    connection.query(sql, function (err, rows) {
        if (err){
            gestionaleLogger.logger.error('comunifactory.getComuni - Internal error: ', err);
            return cb(err);
        }
        else {
            return cb(null,rows)
        }
    });
};

module.exports = comunifactory;