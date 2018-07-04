var articolifactory = require('./articolifactory');
var ARTICOLI_QUERY = "SELECT ART.ID_ARTICOLO ,ART.ID_CATEGORIA,C.NOME_CATEGORIA DESC_CATEGORIA ,ART.CODICE_ARTICOLO ,ART.CODICE_BARRE ,ART.TIPOLOGIA ,ART.DESCRIZIONE ,ART.PREZZO ,ART.VALUTA ,ART.IVA , I.VALORE VALORE_IVA ,ART.PESO ,ART.VOLUME ,ART.CAPACITA ,ART.ULTIMO_PREZZO ,ART.DATA_ULTIMO_ACQUIST ,ART.DATA_INS ,ART.DATA_MOD ,ART.UDM ,ART.NDDT_RICEVUTO , CONVERT(ART.NOTE USING UTF8) AS NOTE, (IFNULL(Q.QTY, 0) - IFNULL(Q.QTY_RISERVATA,0)) QTY, q.ID_MAGAZZINO, q.ID_QTY_MAGAZZINO  FROM QTY_MAGAZZINO Q RIGHT JOIN AN_ARTICOLI ART ON Q.ID_ARTICOLO = ART.ID_ARTICOLO JOIN AN_IVA_APPLICATA I ON ART.IVA = I.CODICE JOIN AN_CAT_ARTICOLI C ON ART.ID_CATEGORIA = C.ID_CATEGORIA WHERE  ART.DELETED = 0 ";
var gestionaleLogger = require("../utility/gestionaleLogger");


articolifactory.getArticoloById = function(id,connection,cb){
    gestionaleLogger.logger.debug('articolifactory::getArticoliById');
    var sql = ARTICOLI_QUERY + ' AND art.ID_ARTICOLO = '+connection.escape(id);
    gestionaleLogger.logger.debug('sql',sql);
    connection.query(sql, function (err, rows) {
        if (err){
            gestionaleLogger.logger.error('articolifactory.getArticoloById - Internal error: ', err);
            return cb(err,null);
        }
        else {
            gestionaleLogger.logger.debug('rows',rows);
            return cb(null,rows)
        }
    });
};


articolifactory.searchArticoli= function (filter, connection,cb){
    gestionaleLogger.logger.debug('articolifactory::searchArticoli');
    var sql = ARTICOLI_QUERY;

    if(filter){
        sql += " AND ( "+
                    " UPPER(ART.CODICE_ARTICOLO) LIKE concat('%', UPPER("+connection.escape(filter)+") , '%') OR " +
                    " UPPER(ART.DESCRIZIONE) LIKE concat('%', UPPER("+connection.escape(filter)+") , '%') OR " +
                    " UPPER(ART.CODICE_BARRE) LIKE concat('%', UPPER("+connection.escape(filter)+") , '%')  " +
	        " )";
    }

    gestionaleLogger.logger.debug('sql',sql);
    connection.query(sql, function (err, rows) {
        if (err){
            gestionaleLogger.logger.error('articolifactory.searchArticoli - Internal error: ', err);
            return cb(err);
        }
        else {
            gestionaleLogger.logger.debug('rows',rows);
            return cb(null,rows)
        }
    });   
}

articolifactory.readArticoliCategories= function(connection, cb){
    gestionaleLogger.logger.debug('articolifactory::readArticoliCategories');
    var sql = 'SELECT * FROM an_cat_articoli WHERE DELETED = 0 AND VISIBILE = 1';
    gestionaleLogger.logger.debug('sql',sql);
    connection.query(sql, function (err, rows) {
        if (err){
            gestionaleLogger.logger.error('articolifactory.readArticoliCategories - Internal error: ', err);
            return cb(err);
        }
        else {
            gestionaleLogger.logger.debug('rows',rows);
            return cb(null,rows)
        }
    });
};

articolifactory.getArticoloByCode = function(code,connection, cb){
    gestionaleLogger.logger.debug('articolifactory::getArticoloByCode');
    var sql = ARTICOLI_QUERY + ' AND UPPER(art.CODICE_ARTICOLO) = UPPER('+connection.escape(code)+')';
    gestionaleLogger.logger.debug('sql',sql);
    connection.query(sql, function (err, rows) {
        if (err){
            gestionaleLogger.logger.error('articolifactory.getArticoloByCode - Internal error: ', err);
            return cb(err);
        }
        else {
            gestionaleLogger.logger.debug('rows',rows);
            return cb(null,rows)
        }
    });
};


articolifactory.readArticoli = function(connection,cb){
    gestionaleLogger.logger.debug('articolifactory::readArticoli');
    var articoliQuery = ARTICOLI_QUERY;		
    connection.query(articoliQuery,function(err, results) {
        if (err) {
            gestionaleLogger.logger.error('articolifactory.readArticoli - Internal error: ', err);
            return cb(err);
        }else {
            return cb(null,results)
        }
    });
};

articolifactory.readArticoliByCategory = function(idCategory, connection,cb){
    gestionaleLogger.logger.debug('articolifactory::readArticoliByCategory');
    var articoliQuery = ARTICOLI_QUERY + " AND C.ID_CATEGORIA = " + connection.escape(idCategory) ;		
    connection.query(articoliQuery,function(err, results) {
        if (err) {
            gestionaleLogger.logger.error('articolifactory.readArticoliByCategory - Internal error: ', err);
            return cb(err);
        }else {
            return cb(null,results)
        }
    });
};

articolifactory.advancedsearch = function(filter, ivaProdotto, ivaServizio, connection,cb){
    gestionaleLogger.logger.debug('articolifactory::advancedsearch');
    var articoliQuery = "SELECT A.ID_ARTICOLO, A.ID_CATEGORIA,C.NOME_CATEGORIA DESC_CATEGORIA, A.CODICE_ARTICOLO, A.DESCRIZIONE, ifnull(F_GET_PREZZO_ARTICOLO_CLIENTE('IMME', A.CODICE_ARTICOLO,"+connection.escape(filter.idCliente)+"), a.prezzo) prezzo, A.UDM, CASE A.TIPOLOGIA WHEN 'PRODOTTO' THEN ";
    if(ivaProdotto!=undefined){
        articoliQuery += connection.escape(ivaProdotto);
    }else{
        articoliQuery += " I.VALORE ";
    }
    
    articoliQuery += " WHEN 'SERVIZIO' THEN ";
    
    if(ivaServizio!=undefined){
        articoliQuery += connection.escape(ivaServizio);
    }else{
        articoliQuery += " I.VALORE ";
    }
        
    articoliQuery +=  " END AS IVA, I.codice  AS CODICE_IVA , (IFNULL(Q.QTY, 0) - IFNULL(Q.QTY_RISERVATA,0)) QTY, q.ID_MAGAZZINO, Q.ID_QTY_MAGAZZINO FROM QTY_MAGAZZINO Q RIGHT JOIN AN_ARTICOLI A ON Q.ID_ARTICOLO = A.ID_ARTICOLO JOIN AN_IVA_APPLICATA I ON A.IVA = I.CODICE  JOIN AN_CAT_ARTICOLI C ON A.ID_CATEGORIA = C.ID_CATEGORIA WHERE A.DELETED = 0 ";

    if(filter!=undefined){
        if(filter.code!=undefined){
            articoliQuery += " AND UPPER(A.CODICE_ARTICOLO) LIKE UPPER(concat('%',"+connection.escape(filter.code)+",'%') ) ";        
        }
        if(filter.descrizione!=undefined){
            articoliQuery += " AND UPPER(A.DESCRIZIONE) LIKE  UPPER(concat('%',"+connection.escape(filter.descrizione)+",'%') ) ";   
        }
    }

    articoliQuery += ";";
    connection.query(articoliQuery,function(err, results) {
        if (err) {
            gestionaleLogger.logger.error('articolifactory.advancedsearch - Internal error: ', err);
            return cb(err);
        }else {
            return cb(null,results)
        }
    });
}





articolifactory.addArticolo = function(idCategoria,codiceArticolo,codiceBarre,descrizione,prezzo,iva,peso,tipologia,volume,ultimoPrezzo,dataUltimoAcquist,udm,nddtRicevuto,note,capacita,valuta,connection,cb){
    gestionaleLogger.logger.debug('articolifactory::addArticolo');
    strInsert="INSERT INTO AN_ARTICOLI (ID_CATEGORIA,CODICE_ARTICOLO,CODICE_BARRE,DESCRIZIONE,PREZZO,IVA,PESO,TIPOLOGIA, VOLUME," +
                    "ULTIMO_PREZZO,DATA_ULTIMO_ACQUIST,UDM,NDDT_RICEVUTO,NOTE,CAPACITA,VALUTA) " +
                " VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);";
    gestionaleLogger.logger.debug('strInsert : ',strInsert);
    connection.query(strInsert,[idCategoria,codiceArticolo,codiceBarre,descrizione,prezzo,iva,peso,tipologia,volume,ultimoPrezzo,dataUltimoAcquist,udm,nddtRicevuto,note,capacita,valuta],function(err, results) {
        if (err) {
            gestionaleLogger.logger.error('articolifactory.addArticolo - Internal error: ', err);
            return cb('KO');
        }else {
            gestionaleLogger.logger.debug("1 record inserted");
            return cb(null, results.insertId)
        }
    });
};

articolifactory.updateArticolo = function(idCategoria,capacita, codiceArticolo,codiceBarre,descrizione,prezzo,iva,peso,tipologia,volume,ultimoPrezzo,dataUltimoAcquist,udm,nddtRicevuto,note,idArticolo,valuta,connection,cb){
    gestionaleLogger.logger.debug('articolifactory::updateArticolo');
     
    var updtStr="UPDATE AN_ARTICOLI SET ";
    updtStr+=(idCategoria!=undefined)?" ID_CATEGORIA ="+connection.escape(idCategoria)+",":"";
    updtStr+=(codiceArticolo!=undefined )?" CODICE_ARTICOLO ="+connection.escape(codiceArticolo)+",":"";
    updtStr+=(codiceBarre!=undefined || codiceBarre==null)?" CODICE_BARRE ="+connection.escape(codiceBarre)+",":"";
    updtStr+=(descrizione!=undefined)?" DESCRIZIONE ="+connection.escape(descrizione)+",":"";
    updtStr+=(prezzo!=undefined || prezzo==null)?" PREZZO ="+connection.escape(prezzo)+",":"";
    updtStr+=(iva!=undefined)?" IVA ="+connection.escape(iva)+",":"";
    updtStr+=(peso!=undefined || peso==null)?" PESO ="+connection.escape(peso)+",":"";
    updtStr+=(tipologia!=undefined )?" TIPOLOGIA ="+connection.escape(tipologia)+",":"";
    updtStr+=(volume!=undefined || volume==null)?" VOLUME ="+connection.escape(volume)+",":"";
    updtStr+=(capacita!=undefined || capacita==null)?" CAPACITA ="+connection.escape(capacita)+",":"";    
    updtStr+=(ultimoPrezzo!=undefined || ultimoPrezzo==null)?" ULTIMO_PREZZO ="+connection.escape(ultimoPrezzo)+",":"";
    updtStr+=(dataUltimoAcquist!=undefined || dataUltimoAcquist==null)?" DATA_ULTIMO_ACQUIST ="+connection.escape(dataUltimoAcquist)+",":"";
    updtStr+=(udm!=undefined)?" UDM ="+connection.escape(udm)+",":"";
    updtStr+=(nddtRicevuto!=undefined || nddtRicevuto==null)?" NDDT_RICEVUTO ="+connection.escape(nddtRicevuto)+",":"";
    updtStr+=(note!=undefined || note==null)?" NOTE ="+connection.escape(note)+",":"";
    updtStr+=(valuta!=undefined )?" VALUTA ="+connection.escape(valuta)+",":"";
    updtStr= updtStr.substring(0, updtStr.length - 1);// elimino l'ultima vigola :)
    updtStr+= " WHERE ID_ARTICOLO ="+connection.escape(idArticolo);
    gestionaleLogger.logger.debug('updtStr',updtStr);
            
    connection.query(updtStr,function(err, results) {
        if (err) {
            gestionaleLogger.logger.error('articolifactory.updateArticolo - Internal error: ', err);
            return cb('KO');
        }else {
            gestionaleLogger.logger.debug("1 record inserted");
            return cb(null, results)
        }
    });
};



articolifactory.deleteArticolo = function(id,connection,cb){
    gestionaleLogger.logger.debug('articolifactory-deleteArticolo');
    deletestr="UPDATE AN_ARTICOLI SET DELETED = 1, DELETE_DATE = CURRENT_TIMESTAMP where ID_ARTICOLO= "+connection.escape(id);
    connection.query(deletestr,function(error, results) {
        if (error) {
            gestionaleLogger.logger.error('articolifactory.deleteArticolo - Internal error: ', error);
            return cb('KO',null);
        }else {
            gestionaleLogger.logger.debug("1 record inserted");
            return cb(null,results)
        }
    });
};

 
module.exports = articolifactory;
