var colorifactory = require('./colorifactory');
var gestionaleLogger = require("../utility/gestionaleLogger");



colorifactory.getAll = function(connection,cb){
    gestionaleLogger.logger.debug('colorifactory::getAll');
    var sql = "SELECT ID_COLORE, CODICE, DESCRIZIONE FROM AN_COLORE";
    gestionaleLogger.logger.debug('sql',sql);
    connection.query(sql, function (err, rows) {
        if (err){
            gestionaleLogger.logger.error('colorifactory.getAll - Internal error: ', err);
            return cb(err,null);
        }
        else {
            return cb(null,rows)
        }
    });
}

colorifactory.getById = function(idColore,connection,cb){
    gestionaleLogger.logger.debug('colorifactory::getAll');
    var sql = "SELECT SELECT ID_COLORE, CODICE, DESCRIZIONE FROM AN_COLORE WHERE ID_COLORE = " + connection.escape(idColore);
    gestionaleLogger.logger.debug('sql',sql);
    connection.query(sql, function (err, rows) {
        if (err){
            gestionaleLogger.logger.error('colorifactory.getAll - Internal error: ', err);
            return cb(err,null);
        }
        else {
            return cb(null,rows)
        }
    });
}

colorifactory.deleteById = function(idColore,connection,cb){
    gestionaleLogger.logger.debug('colorifactory::deleteById');
    var sql = "DELETE FROM AN_COLORE WHERE ID_colore = " + connection.escape(idColore);
    gestionaleLogger.logger.debug('sql',sql);
    connection.query(sql, function (err, rows) {
        if (err){
            gestionaleLogger.logger.error('colorifactory.deleteById - Internal error: ', err);
            return cb(err,null);
        }
        else {
            return cb(null,rows)
        }
    });
}

colorifactory.postcolore = function(colore, connection,cb){
    gestionaleLogger.logger.debug('colorifactory::postcolore');
    var strInsert = "INSERT INTO AN_COLORE(ID_COLORE, CODICE, DESCRIZIONE) VALUES(?,?,?);"
    gestionaleLogger.logger.debug('strInsert : ',strInsert);
    connection.query(strInsert,[colore.idColore,colore.codice,colore.descrizione],function(err, results) {
        if (err) {
            gestionaleLogger.logger.error('colorifactory.postcolore - Internal error: ', err);
            return cb('KO');
        }else {
            gestionaleLogger.logger.debug("1 record inserted");
            return cb(null, results.insertId)
        }
    });
}

colorifactory.putcolore = function(idColore, colore, connection,cb){
    gestionaleLogger.logger.debug('colorifactory::putcolore');
    
   var updtStr="UPDATE AN_COLORE SET ";
   updtStr+=(colore.codice!=undefined)?" CODICE ="+connection.escape(colore.codice)+",":"";
   updtStr+=(colore.descrizione!=undefined)?" DESCRIZIONE ="+connection.escape(colore.descrizione)+",":"";
   updtStr= updtStr.substring(0, updtStr.length - 1);// elimino l'ultima vigola :)
   updtStr+= " WHERE ID_COLORE ="+connection.escape(idColore);
   gestionaleLogger.logger.debug('updtStr',updtStr);
           
   connection.query(updtStr,function(err, results) {
       if (err) {
           gestionaleLogger.logger.error('colorifactory.putcolore - Internal error: ', err);
           return cb('KO');
       }else {
           return cb(null, results)
       }
   });
}
    
    


 
module.exports = colorifactory;
