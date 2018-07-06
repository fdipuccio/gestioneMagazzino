var articolifactory = require('./articolifactory');
var ARTICOLI_QUERY = "SELECT ART.ID_ARTICOLO , " + 
                        " ART.ID_CATEGORIA, " + 
                        " C.NOME_CATEGORIA DESC_CATEGORIA , " + 
                        " ART.CODICE_ARTICOLO , " + 
                        " ART.CODICE_BARRE , " + 
                        " ART.TIPOLOGIA , " + 
                        " ART.DESCRIZIONE , " + 
                        " ART.LUNGHEZZA , " +
                        " L.DESCRIZIONE UDM_LUNGHEZZA , " +
                        " ART.QTY_SCATOLA , " +
                        " Q.DESCRIZIONE UDM_QTY_SCATOLA , " +
                        " ART.TIMER_SCADENZA_HH , " +
                        " ART.MINIMO_MAGAZZINO , " +
                        " ART.DIAMETRO , " +
                        " L.DESCRIZIONE UDM_DIAMETRO , " +
                        " ART.MARCA , " +
                        " C.DESCRIZIONE COLORE , " +
                        " ART.PESO , " + 
                        " P.DESCRIZIONE UDM_PESO , " +
                        " ART.VOLUME , " + 
                        " V.DESCRIZIONE UDM_VOLUME , " +
                        " ART.CAPACITA , " + 
                        " CP.DESCRIZIONE UDM_CAPACITA , " +
                        " ART.PREZZO , " + 
                        " ART.VALUTA , " + 
                        " ART.IVA , " + 
                        " I.VALORE VALORE_IVA , " + 
                        " ART.DATA_INS , " + 
                        " ART.DATA_MOD , " + 
                        " ART.UDM , " + 
                        " CONVERT(ART.NOTE USING UTF8) AS NOTE,  " + 
                        " (IFNULL(Q.QTY, 0) - IFNULL(Q.QTY_RISERVATA,0)) QTY, " + 
                        "  q.ID_MAGAZZINO, " + 
                        "  q.ID_QTY_MAGAZZINO   " + 
                        " FROM QTY_MAGAZZINO Q RIGHT  " + 
                        "   JOIN AN_ARTICOLI ART ON Q.ID_ARTICOLO = ART.ID_ARTICOLO  " + 
                        "   JOIN AN_IVA_APPLICATA I ON ART.IVA = I.CODICE  " + 
                        "   JOIN AN_UDM_LUNGHEZZA L ON L.ID_UDM = ART.UDM_LUNGHEZZA  " + 
                        "   JOIN AN_UDM_DIAMETRO D ON D.ID_UDM = ART.UDM_DIAMETRO  " + 
                        "   JOIN AN_COLORE C ON C.ID_COLORE = ART.COLORE  " + 
                        "   JOIN AN_UDM_PESO P ON P.ID_UDM = ART.UDM_PESO  " + 
                        "   JOIN AN_UDM_QTY_SCATOLA Q ON Q.ID_UDM = ART.UDM_QTY_SCATOLA  " + 
                        "   JOIN AN_UDM_VOLUME V ON V.ID_UDM = ART.UDM_VOLUME  " + 
                        "   JOIN AN_UDM_CAPACITA CP ON CP.ID_UDM = ART.UDM_CAPACITA  " + 
                        "   JOIN AN_CAT_ARTICOLI C ON ART.ID_CATEGORIA = C.ID_CATEGORIA  " + 
                        " WHERE  ART.DELETED = 0 ";
                        
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
        sql += gestioneFiltriArticoli(filter, sql);
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


//adeguare
articolifactory.advancedsearch = function(filter, ivaProdotto, ivaServizio, connection,cb){
    gestionaleLogger.logger.debug('articolifactory::advancedsearch');
    var articoliQuery = "SELECT A.ID_ARTICOLO, " + 
                            " A.ID_CATEGORIA, " + 
                            " C.NOME_CATEGORIA DESC_CATEGORIA, " + 
                            " A.CODICE_ARTICOLO,  " + 
                            " A.DESCRIZIONE,  " + 
                            " ifnull(F_GET_PREZZO_ARTICOLO_CLIENTE('IMME', A.CODICE_ARTICOLO,"+connection.escape(filter.idCliente)+"), a.prezzo) prezzo,  " + 
                            " A.UDM,  " + 
                            " CASE A.TIPOLOGIA  " + 
                            "   WHEN 'PRODOTTO' THEN ";
    
    
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
        
    articoliQuery +=  " END AS IVA,   " + 
                        " I.codice  AS CODICE_IVA ,  " + 
                        " (IFNULL(Q.QTY, 0) - IFNULL(Q.QTY_RISERVATA,0)) QTY,  " + 
                        " q.ID_MAGAZZINO,  " + 
                        " Q.ID_QTY_MAGAZZINO   " + 
                        " FROM QTY_MAGAZZINO Q   " + 
                        "   RIGHT JOIN AN_ARTICOLI A ON Q.ID_ARTICOLO = A.ID_ARTICOLO   " + 
                        "   JOIN AN_IVA_APPLICATA I ON A.IVA = I.CODICE    " + 
                        "   JOIN AN_CAT_ARTICOLI C ON A.ID_CATEGORIA = C.ID_CATEGORIA   " + 
                        " WHERE A.DELETED = 0 ";

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





articolifactory.addArticolo = function(articolo,connection,cb){
    gestionaleLogger.logger.debug('articolifactory::addArticolo');
    strInsert = "INSERT INTO AN_ARTICOLI (ID_CATEGORIA, " + 
                                        " CODICE_ARTICOLO , " + 
                                        " CODICE_BARRE, " + 
                                        " DESCRIZIONE, " + 
                                        " LUNGHEZZA, " + 
                                        " UDM_LUNGHEZZA, " + 
                                        " QTY_SCATOLA, " + 
                                        " UDM_QTY_SCATOLA, " + 
                                        " TIMER_SCADENZA_HH, " + 
                                        " MINIMO_MAGAZZINO, " + 
                                        " DIAMETRO, " + 
                                        " UDM_DIAMETRO, " + 
                                        " MARCA, " + 
                                        " COLORE, " + 
                                        " PREZZO , " + 
                                        " VALUTA, " + 
                                        " IVA , " + 
                                        " PESO , " + 
                                        " UDM_PESO, " + 
                                        " VOLUME , " + 
                                        " UDM_VOLUME, " + 
                                        " CAPACITA, " + 
                                        " UDM_CAPACITA, " + 
                                        " UDM, " + 
                                        " NOTE) " +
                " VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);"
    gestionaleLogger.logger.debug('strInsert : ',strInsert);
    connection.query(strInsert,[articolo.idCategoria,
                                articolo.codiceArticolo,
                                articolo.codiceBarre,
                                articolo.descrizione,
                                articolo.lunghezza, 
                                articolo.udmLunghezza, 
                                articolo.qtyInScatola, 
                                articolo.udmQtyInScatola, 
                                articolo.timerScadenza,
                                articolo.minimoMagazzino, 
                                articolo.diametro, 
                                articolo.udmDiametro, 
                                articolo.marca, 
                                articolo.colore, 
                                articolo.prezzo, 
                                articolo.valuta, 
                                articolo.iva, 
                                articolo.peso, 
                                articolo.udmPeso,
                                articolo.volume, 
                                articolo.udmVolume, 
                                articolo.capacita, 
                                articolo.udmCapacita, 
                                articolo.udm, 
                                articolo.note],function(err, results) {
        if (err) {
            gestionaleLogger.logger.error('articolifactory.addArticolo - Internal error: ', err);
            return cb('KO');
        }else {
            gestionaleLogger.logger.debug("1 record inserted");
            return cb(null, results.insertId)
        }
    });
};

articolifactory.updateArticolo = function(articolo,connection,cb){
    gestionaleLogger.logger.debug('articolifactory::updateArticolo');
     
    var updtStr="UPDATE AN_ARTICOLI SET ";
    updtStr+=(articolo.idCategoria!=undefined)?" ID_CATEGORIA ="+connection.escape(articolo.idCategoria)+",":"";
    updtStr+=(articolo.codiceArticolo!=undefined )?" CODICE_ARTICOLO ="+connection.escape(articolo.codiceArticolo)+",":"";
    updtStr+=(articolo.codiceBarre!=undefined || codiceBarre==null)?" CODICE_BARRE ="+connection.escape(articolo.codiceBarre)+",":"";
    updtStr+=(articolo.descrizione!=undefined)?" DESCRIZIONE ="+connection.escape(articolo.descrizione)+",":"";
    updtStr+=(articolo.lunghezza!=undefined || articolo.lunghezza==null)?" LUNGHEZZA ="+connection.escape(articolo.lunghezza)+",":"";
    updtStr+=(articolo.udmLunghezza!=undefined || articolo.udmLunghezza==null)?" UDM_LUNGHEZZA ="+connection.escape(articolo.udmLunghezza)+",":"";
    updtStr+=(articolo.qtyInScatola!=undefined || articolo.qtyInScatola==null)?" QTY_SCATOLA ="+connection.escape(articolo.qtyInScatola)+",":"";
    updtStr+=(articolo.udmQtyInScatola!=undefined || articolo.udmQtyInScatola==null)?" UDM_QTY_SCATOLA ="+connection.escape(articolo.udmQtyInScatola)+",":"";
    updtStr+=(articolo.timerScadenza!=undefined || articolo.timerScadenza==null)?" TIMER_SCADENZA_HH ="+connection.escape(articolo.timerScadenza)+",":"";
    updtStr+=(articolo.minimoMagazzino!=undefined || articolo.minimoMagazzino==null)?" MINIMO_MAGAZZINO ="+connection.escape(articolo.minimoMagazzino)+",":"";
    updtStr+=(articolo.diametro!=undefined || articolo.diametro==null)?" DIAMETRO ="+connection.escape(articolo.diametro)+",":"";
    updtStr+=(articolo.udmDiametro!=undefined || articolo.udmDiametro==null)?" UDM_DIAMETRO ="+connection.escape(articolo.udmDiametro)+",":"";
    updtStr+=(articolo.marca!=undefined || articolo.marca==null)?" UDM_DIAMETRO ="+connection.escape(articolo.marca)+",":"";
    updtStr+=(articolo.colore!=undefined || articolo.colore==null)?" COLORE ="+connection.escape(articolo.colore)+",":"";
    updtStr+=(articolo.prezzo!=undefined || articolo.prezzo==null)?" PREZZO ="+connection.escape(articolo.prezzo)+",":"";
    updtStr+=(articolo.valuta!=undefined )?" VALUTA ="+connection.escape(articolo.valuta)+",":"";
    updtStr+=(articolo.iva!=undefined)?" IVA ="+connection.escape(articolo.iva)+",":"";
    updtStr+=(articolo.peso!=undefined || articolo.peso==null)?" PESO ="+connection.escape(articolo.peso)+",":"";
    updtStr+=(articolo.udmPeso!=undefined || articolo.udmPeso==null)?" UDM_PESO ="+connection.escape(articolo.udmPeso)+",":"";
    updtStr+=(articolo.volume!=undefined || articolo.volume==null)?" VOLUME ="+connection.escape(articolo.volume)+",":"";
    updtStr+=(articolo.udmVolume!=undefined || articolo.udmVolume==null)?" UDM_VOLUME ="+connection.escape(articolo.udmVolume)+",":"";
    updtStr+=(articolo.capacita!=undefined || articolo.capacita==null)?" CAPACITA ="+connection.escape(articolo.capacita)+",":"";    
    updtStr+=(articolo.udmCapacita!=undefined || articolo.udmCapacita==null)?" UDM_CAPACITA ="+connection.escape(articolo.udmCapacita)+",":"";    
    updtStr+=(articolo.udm!=undefined)?" UDM ="+connection.escape(articolo.udm)+",":"";
    updtStr+=(articolo.note!=undefined || articolo.note==null)?" NOTE ="+connection.escape(articolo.note)+",":"";
    updtStr+=" DATA_MOD = CURRENT_TIMESTAMP, ";
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






function gestioneFiltriArticoli(filter, sql){
    var retVal = sql;

    if(filter.categoria){
        retVal += " AND ART.ID_CATEGORIA ="+connection.escape(filter.categoria)+" ";
    }

    if(filter.codiceArticolo){
        retVal += " AND UPPER(ART.CODICE_ARTICOLO) LIKE concat('%', UPPER("+connection.escape(filter.codiceArticolo)+") , '%') ";
    }

    if(filter.codiceBarre){
        retVal += " AND ART.CODICE_BARRE ="+connection.escape(filter.codiceBarre)+" ";
    }

    if(filter.descrizione){
        retVal += " AND UPPER(ART.DESCRIZIONE) LIKE concat('%', UPPER("+connection.escape(filter.descrizione)+") , '%') ";
    }

    if(filter.lunghezza){
        retVal += " AND ART.LUNGHEZZA ="+connection.escape(filter.lunghezza)+" ";
    }

    if(filter.qtyScatola){
        retVal += " AND ART.QTY_SCATOLA ="+connection.escape(filter.qtyScatola)+" ";
    }

    if(filter.timerScadenza){
        retVal += " AND ART.TIMER_SCADENZA_HH ="+connection.escape(filter.timerScadenza)+" ";
    }
    
    if(filter.minimoMagazzino){
       // " ART.MINIMO_MAGAZZINO , " + 
    }
    
    if(filter.diametro){
       // " ART.DIAMETRO , " + 
    }
    
    if(filter.marca){
        //" ART.MARCA , " + 
    }

    if(filter.colore){ //id
        //" ART.COLORE , " + 
    }
    
    if(filter.peso){
        //" ART.PESO , " + 
    }
 
    if(filter.volume){
        //" ART.VOLUME , " + 
    }

    if(filter.capacita){
        //" ART.CAPACITA , " + 
    }

    if(filter.prezzo){
        //" ART.PREZZO , " + 
    }

    if(filter.valuta){
        //" ART.VALUTA , " + 
    }

    if(filter.iva){
        //" ART.IVA , " + 
    }

    if(filter.dataInserimento){
        //" ART.DATA_INS , " + 
    }

    if(filter.dataModifica){
        //" ART.DATA_MOD , " + 
    }

    if(filter.udm){
        //" ART.UDM , " + 
    }

    if(filter.note){
        //" ART.NOTE , " + 
    }

    if(filter.qty){
       // " (IFNULL(Q.QTY, 0) - IFNULL(Q.QTY_RISERVATA,0)) QTY, " + 
    }

    if(filter.magazzino){
       // "  q.ID_MAGAZZINO, " +
    }

    




    
    /*"  q.ID_QTY_MAGAZZINO   " + 
        sql += " AND ( "+
        " UPPER(ART.CODICE_ARTICOLO) LIKE concat('%', UPPER("+connection.escape(filter)+") , '%') OR " +
        " UPPER(ART.DESCRIZIONE) LIKE concat('%', UPPER("+connection.escape(filter)+") , '%') OR " +
        " UPPER(ART.CODICE_BARRE) LIKE concat('%', UPPER("+connection.escape(filter)+") , '%')  " +
    " )";*/

    return retVal;
    
    }

 
module.exports = articolifactory;
