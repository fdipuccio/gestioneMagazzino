var categoriearticolofactory = require('./categoriearticolofactory');
var gestionaleLogger = require("../utility/gestionaleLogger");



categoriearticolofactory.getAll = function(connection,cb){
    gestionaleLogger.logger.debug('categoriearticolofactory::getAll');
    var sql = "SELECT ID_CATEGORIA, NOME_CATEGORIA, DESCRIZIONE FROM AN_CAT_ARTICOLI WHERE DELETED = 0";
    gestionaleLogger.logger.debug('sql',sql);
    connection.query(sql, function (err, rows) {
        if (err){
            gestionaleLogger.logger.error('categoriearticolofactory.getAll - Internal error: ', err);
            return cb(err,null);
        }
        else {
            return cb(null,rows)
        }
    });
}

categoriearticolofactory.getById = function(idCategoria,connection,cb){
    gestionaleLogger.logger.debug('categoriearticolofactory::getAll');
    var sql = "SELECT ID_CATEGORIA, NOME_CATEGORIA, DESCRIZIONE FROM AN_CAT_ARTICOLI WHERE DELETED = 0 AND ID_CATEGORIA = " + connection.escape(idCategoria);
    gestionaleLogger.logger.debug('sql',sql);
    connection.query(sql, function (err, rows) {
        if (err){
            gestionaleLogger.logger.error('categoriearticolofactory.getAll - Internal error: ', err);
            return cb(err,null);
        }
        else {
            return cb(null,rows)
        }
    });
}

categoriearticolofactory.deleteById = function(idCategoria,connection,cb){
    gestionaleLogger.logger.debug('categoriearticolofactory::getAll');
    var sql = "UPDATE AN_CAT_ARTICOLI SET DELETED = 1, DELETE_DATE = CURRENT_TIMESTAMP WHERE ID_CATEGORIA = " + connection.escape(idCategoria);
    gestionaleLogger.logger.debug('sql',sql);
    connection.query(sql, function (err, rows) {
        if (err){
            gestionaleLogger.logger.error('categoriearticolofactory.getAll - Internal error: ', err);
            return cb(err,null);
        }
        else {
            return cb(null,rows)
        }
    });
}

categoriearticolofactory.canBeDeleted = function(idCategoria,connection,cb){
    gestionaleLogger.logger.debug('categoriearticolofactory::canBeDeleted');
    var sql = " SELECT IF(COUNT(1) = 0,'Y','N') CAN_DELETE " +
              " FROM AN_CAT_ARTICOLI C  " +
              " 	JOIN AN_ARTICOLI A ON C.ID_CATEGORIA=A.ID_CATEGORIA " +
              " WHERE C.ID_CATEGORIA = " + connection.escape(idCategoria);
    gestionaleLogger.logger.debug('sql',sql);
    connection.query(sql, function (err, rows) {
        if (err){
            gestionaleLogger.logger.error('categoriearticolofactory.canBeDeleted - Internal error: ', err);
            return cb(err,null);
        }
        else {
            return cb(null,results[0].CAN_DELETE=='Y')
        }
    });
}

categoriearticolofactory.postCategoria = function(categoria, connection,cb){
    gestionaleLogger.logger.debug('categoriearticolofactory::postCategoria');
    var strInsert = "INSERT INTO AN_CAT_ARTICOLI(ID_CATEGORIA, NOME_CATEGORIA, DESCRIZIONE) VALUES(?,?,?);"
    gestionaleLogger.logger.debug('strInsert : ',strInsert);
    connection.query(strInsert,[categoria.idCategoria,categoria.nome,categoria.descrizione],function(err, results) {
        if (err) {
            gestionaleLogger.logger.error('categoriearticolofactory.postCategoria - Internal error: ', err);
            return cb('KO');
        }else {
            gestionaleLogger.logger.debug("1 record inserted");
            return cb(null, results.insertId)
        }
    });
}

categoriearticolofactory.putCategoria = function(idCategoria, categoria, connection,cb){
    gestionaleLogger.logger.debug('categoriearticolofactory::putCategoria');
    
   var updtStr="UPDATE an_cat_articoli SET ";
   updtStr+=(categoria.nome!=undefined)?" NOME_CATEGORIA ="+connection.escape(categoria.nome)+",":"";
   updtStr+=(categoria.descrizione!=undefined)?" DESCRIZIONE ="+connection.escape(categoria.descrizione)+",":"";
   updtStr= updtStr.substring(0, updtStr.length - 1);// elimino l'ultima vigola :)
   updtStr+= " WHERE ID_CATEGORIA ="+connection.escape(idCategoria);
   gestionaleLogger.logger.debug('updtStr',updtStr);
           
   connection.query(updtStr,function(err, results) {
       if (err) {
           gestionaleLogger.logger.error('categoriearticolofactory.putCategoria - Internal error: ', err);
           return cb('KO');
       }else {
           return cb(null, results)
       }
   });
}
    
    


 
module.exports = categoriearticolofactory;
