var articolifactory = require('./articolifactory');
var ARTICOLI_QUERY = "SELECT ART.ID_ARTICOLO , " + 
                        " ART.ID_CATEGORIA, " + 
                        " C.NOME_CATEGORIA DESC_CATEGORIA , " + 
                        " ART.CODICE_ARTICOLO , " + 
                        " ART.CODICE_BARRE , " + 
                        " ART.TIPOLOGIA , " + 
                        " ART.DESCRIZIONE , " + 
                        " ART.LUNGHEZZA , " +
                        " L.ID_UDM ID_UDM_LUNGHEZZA , " +
                        " L.DESCRIZIONE UDM_LUNGHEZZA , " +
                        " ART.QTY_SCATOLA , " +
                        " QS.ID_UDM ID_UDM_QTY_SCATOLA , " +
                        " QS.DESCRIZIONE UDM_QTY_SCATOLA , " +
                        " ART.TIMER_SCADENZA_DD , " +
                        " ART.MINIMO_MAGAZZINO , " +
                        " ART.DIAMETRO , " +
                        " D.ID_UDM ID_UDM_DIAMETRO , " +
                        " D.DESCRIZIONE UDM_DIAMETRO , " +
                        " ART.MARCA , " +
                        " CL.ID_COLORE ID_COLORE , " +
                        " CL.DESCRIZIONE COLORE , " +
                        " ART.PESO , " + 
                        " P.ID_UDM ID_UDM_PESO , " +
                        " P.DESCRIZIONE UDM_PESO , " +
                        " ART.VOLUME , " + 
                        " V.ID_UDM ID_UDM_VOLUME , " +
                        " V.DESCRIZIONE UDM_VOLUME , " +
                        " ART.CAPACITA , " + 
                        " CP.ID_UDM ID_UDM_CAPACITA , " +
                        " CP.DESCRIZIONE UDM_CAPACITA , " +
                        " ART.PREZZO , " + 
                        " ART.VALUTA , " + 
                        " ART.IVA , " + 
                        " I.VALORE VALORE_IVA , " + 
                        " ART.DATA_INS , " + 
                        " ART.DATA_MOD , " + 
                        " ART.UDM , " + 
                        " CONVERT(ART.NOTE USING UTF8) AS NOTE,  " +
                        " Q.QTY " + 
                        //", " + 
                        // "  q.ID_MAGAZZINO, " + 
                        // "  q.ID_QTY_MAGAZZINO   " + 
                        " FROM AN_ARTICOLI ART  " + 
                        "   LEFT JOIN (SELECT SUM(QTY) QTY, ID_ARTICOLO FROM LG_QTY_ARTICOLO GROUP BY ID_ARTICOLO) Q  ON Q.ID_ARTICOLO = ART.ID_ARTICOLO  " + 
                        "   LEFT JOIN AN_IVA_APPLICATA I ON ART.IVA = I.CODICE  " + 
                        "   LEFT JOIN (SELECT * FROM AN_UDM WHERE UDM_TYPE = 'LUNGHEZZA') L ON L.ID_UDM = ART.UDM_LUNGHEZZA  " + 
                        "   LEFT JOIN (SELECT * FROM AN_UDM WHERE UDM_TYPE = 'DIAMETRO') D ON D.ID_UDM = ART.UDM_DIAMETRO  " + 
                        "   JOIN AN_COLORE CL ON CL.ID_COLORE = ART.COLORE  " + 
                        "   LEFT JOIN (SELECT * FROM AN_UDM WHERE UDM_TYPE = 'PESO') P ON P.ID_UDM = ART.UDM_PESO  " + 
                        "   LEFT JOIN (SELECT * FROM AN_UDM WHERE UDM_TYPE = 'QTYSCATOLA') QS ON QS.ID_UDM = ART.UDM_QTY_SCATOLA  " + 
                        "   LEFT JOIN (SELECT * FROM AN_UDM WHERE UDM_TYPE = 'VOLUME') V ON V.ID_UDM = ART.UDM_VOLUME  " + 
                        "   LEFT JOIN (SELECT * FROM AN_UDM WHERE UDM_TYPE = 'CAPACITA') CP ON CP.ID_UDM = ART.UDM_CAPACITA  " + 
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


articolifactory.getNewBarcode = function(connection,cb){
    gestionaleLogger.logger.debug('articolifactory::getNewBarcode');
    var sql = "SELECT nextval('SEQ_BARCODE') MAX_ID ";
    gestionaleLogger.logger.debug('sql',sql);
    connection.query(sql, function (err, rows) {
        if (err){
            gestionaleLogger.logger.error('articolifactory.getNewBarcode - Internal error: ', err);
            return cb(err,null);
        }
        else {
            gestionaleLogger.logger.debug('rows',rows);
            return cb(null,rows[0].MAX_ID)
        }
    });
};


articolifactory.searchArticoli= function (filter, connection,cb){
    gestionaleLogger.logger.debug('articolifactory::searchArticoli');
    var sql = ARTICOLI_QUERY;

    if(filter){
        sql = gestioneFiltriArticoli(filter, sql, connection);
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
                                        " TIMER_SCADENZA_DD, " + 
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
                " VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);"
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

articolifactory.updateArticolo = function(articolo,idArticolo,connection,cb){
    gestionaleLogger.logger.debug('articolifactory::updateArticolo');
     
    var updtStr="UPDATE AN_ARTICOLI SET ";
    updtStr+=(articolo.idCategoria!=undefined)?" ID_CATEGORIA ="+connection.escape(articolo.idCategoria)+",":"";
    updtStr+=(articolo.codiceArticolo!=undefined )?" CODICE_ARTICOLO ="+connection.escape(articolo.codiceArticolo)+",":"";
    updtStr+=(articolo.codiceBarre!=undefined || codiceBarre==null)?" CODICE_BARRE ="+connection.escape(articolo.codiceBarre)+",":"";
    updtStr+=(articolo.descrizione!=undefined)?" DESCRIZIONE ="+connection.escape(articolo.descrizione)+",":"";
    updtStr+=(articolo.lunghezza!=undefined || articolo.lunghezza==null)?" LUNGHEZZA ="+connection.escape(articolo.lunghezza)+",":"";
    updtStr+=(articolo.idUdmLunghezza!=undefined || articolo.idUdmLunghezza==null)?" UDM_LUNGHEZZA ="+connection.escape(articolo.idUdmLunghezza )+",":"";
    updtStr+=(articolo.qtyInScatola!=undefined || articolo.qtyInScatola==null)?" QTY_SCATOLA ="+connection.escape(articolo.qtyInScatola)+",":"";
    updtStr+=(articolo.idUdmQtyInScatola!=undefined || articolo.idUdmQtyInScatola==null)?" UDM_QTY_SCATOLA ="+connection.escape(articolo.idUdmQtyInScatola)+",":"";
    updtStr+=(articolo.timerScadenza!=undefined || articolo.timerScadenza==null)?" TIMER_SCADENZA_DD ="+connection.escape(articolo.timerScadenza)+",":"";
    updtStr+=(articolo.minimoMagazzino!=undefined || articolo.minimoMagazzino==null)?" MINIMO_MAGAZZINO ="+connection.escape(articolo.minimoMagazzino)+",":"";
    updtStr+=(articolo.diametro!=undefined || articolo.diametro==null)?" DIAMETRO ="+connection.escape(articolo.diametro)+",":"";
    updtStr+=(articolo.idUdmDiametro!=undefined || articolo.idUdmDiametro==null)?" UDM_DIAMETRO ="+connection.escape(articolo.idUdmDiametro)+",":"";
    updtStr+=(articolo.marca!=undefined || articolo.marca==null)?" MARCA ="+connection.escape(articolo.marca)+",":"";
    updtStr+=(articolo.idColore!=undefined || articolo.idColore==null)?" COLORE ="+connection.escape(articolo.idColore)+",":"";
    updtStr+=(articolo.prezzo!=undefined || articolo.prezzo==null)?" PREZZO ="+connection.escape(articolo.prezzo)+",":"";
    updtStr+=(articolo.valuta!=undefined )?" VALUTA ="+connection.escape(articolo.valuta)+",":"";
    updtStr+=(articolo.iva!=undefined)?" IVA ="+connection.escape(articolo.iva)+",":"";
    updtStr+=(articolo.peso!=undefined || articolo.peso==null)?" PESO ="+connection.escape(articolo.peso)+",":"";
    updtStr+=(articolo.idUdmPeso!=undefined || articolo.idUdmPeso==null)?" UDM_PESO ="+connection.escape(articolo.idUdmPeso)+",":"";
    updtStr+=(articolo.volume!=undefined || articolo.volume==null)?" VOLUME ="+connection.escape(articolo.volume)+",":"";
    updtStr+=(articolo.idUdmVolume!=undefined || articolo.idUdmVolume==null)?" UDM_VOLUME ="+connection.escape(articolo.idUdmVolume)+",":"";
    updtStr+=(articolo.capacita!=undefined || articolo.capacita==null)?" CAPACITA ="+connection.escape(articolo.capacita)+",":"";    
    updtStr+=(articolo.idUdmCapacita!=undefined || articolo.idUdmCapacita==null)?" UDM_CAPACITA ="+connection.escape(articolo.idUdmCapacita)+",":"";    
    updtStr+=(articolo.udm!=undefined)?" UDM ="+connection.escape(articolo.udm)+",":"";
    updtStr+=(articolo.note!=undefined || articolo.note==null)?" NOTE ="+connection.escape(articolo.note)+",":"";
    updtStr+=" DATA_MOD = CURRENT_TIMESTAMP,";
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


articolifactory.getDisponibilitaArticolo = function(idArticolo, connection, cb){
    gestionaleLogger.logger.debug('articolifactory-getDisponibilitaArticolo');    
    var sql = " SELECT A.CODICE_ARTICOLO, A.DESCRIZIONE DESCRIZIONE_ARTICOLO, Q.NLOTTO, Q.QTY, Q.SCADENZA, M.NOME_MAGAZZINO, M.ID_MAGAZZINO, Q.REPARTO, Q.SCAFFALE, Q.POSTO " + 
              "  FROM LG_QTY_ARTICOLO Q " + 
              "  JOIN AN_ARTICOLI A ON A.ID_ARTICOLO=Q.ID_ARTICOLO " + 
              "  JOIN AN_MAGAZZINI M ON M.ID_MAGAZZINO=Q.ID_MAGAZZINO  " + 
              "  WHERE Q.ID_ARTICOLO=" + connection.escape(idArticolo) +
              " ORDER BY Q.SCADENZA "
    connection.query(sql,function(error, results) {
        if (error) {
            gestionaleLogger.logger.error('articolifactory.getDisponibilitaArticolo - Internal error: ', error);
            return cb('KO',null);
        }else {
            return cb(null,results)
        }
    });
             
}

articolifactory.getGraficoAcArticolo = function(idArticolo, connection, cb){
    gestionaleLogger.logger.debug('articolifactory-getGraficoAcArticolo');  
    var sql = " SELECT MESEANNO, QTY_CARICO, QTY_SCARICO, PROP_VALUE FROM VW_GRAFICO_AC_ARTICOLO WHERE ID_ARTICOLO = " + connection.escape(idArticolo) + " ORDER BY MESEANNO DESC ";
    connection.query(sql,function(error, results) {
        if (error) {
            gestionaleLogger.logger.error('articolifactory.getGraficoAcArticolo - Internal error: ', error);
            return cb('KO',null);
        }else {
            return cb(null,results)
        }
    });
             
}


articolifactory.getStoricoArticolo = function(idArticolo, startDate, endDate, connection, cb){
    gestionaleLogger.logger.debug('articolifactory-getStoricoArticolo');  
    var sql = " SELECT ART.ID_ARTICOLO, " +
              "     ART.CODICE_ARTICOLO, " +
              "     TIPO_OPERAZIONE, " +
              "     SUM(MOV.QTY) QTY , " +
              "     DATE_FORMAT(DATA_CREAZIONE, '%d/%m/%Y') DATA_CREAZIONE , " +
              "     F.ID ID_FORNITORE, " +
              "     F.NOME NOME_FORNITORE, " +
              "     PREZZO_ACQUISTO " +
              "  FROM LG_LOTTI_MAGAZZINO LT " +
              "  JOIN (SELECT NLOTTO, TIPO_OPERAZIONE, SUM(QTY) QTY  " +
              "          FROM LG_MOVIMENTI_MAGAZZINO " +
              "          GROUP BY NLOTTO, TIPO_OPERAZIONE) MOV ON MOV.NLOTTO=LT.NLOTTO " +
              "  JOIN AN_ARTICOLI ART ON ART.ID_ARTICOLO = LT.ID_ARTICOLO " +
              "  JOIN AN_FORNITORI F ON F.ID=LT.ID_FORNITORE " +
              "  WHERE ART.ID_ARTICOLO = " + connection.escape(idArticolo);
    
    if(startDate && endDate){
        sql += " AND DATA_CREAZIONE BETWEEN STR_TO_DATE("+connection.escape(startDate) +",'%e/%c/%Y %T') AND STR_TO_DATE("+connection.escape(endDate) +",'%e/%c/%Y %T') ";
    }else if(startDate && !endDate){
        sql += "  AND DATA_CREAZIONE >= STR_TO_DATE("+connection.escape(startDate) +",'%e/%c/%Y %T') ";
    }else if(!startDate && endDate){
        sql += "  AND DATA_CREAZIONE <= STR_TO_DATE("+connection.escape(endDate) +",'%e/%c/%Y %T') ";
    }

    sql += "  GROUP BY ID_ARTICOLO, DATA_CREAZIONE, TIPO_OPERAZIONE,ID_FORNITORE, PREZZO_ACQUISTO";
    connection.query(sql,function(error, results) {
        if (error) {
            gestionaleLogger.logger.error('articolifactory.getStoricoArticolo - Internal error: ', error);
            return cb('KO',null);
        }else {
            return cb(null,results)
        }
    });
             
}





articolifactory.getAndamentoPrezzo = function(idArticolo, startDate, endDate, connection, cb){
    gestionaleLogger.logger.debug('articolifactory-getAndamentoPrezzo');    
    var sql = "SELECT DATE_FORMAT(DATA_CREAZIONE, '%d/%m/%Y') DATA_OPERAZIONE, MAX(PREZZO_ACQUISTO) PREZZO_ACQUISTO " +
              "  FROM LG_LOTTI_MAGAZZINO " +
              "  WHERE ID_ARTICOLO =  " + connection.escape(idArticolo) +
              "  AND DATA_CREAZIONE BETWEEN STR_TO_DATE("+connection.escape(startDate) +",'%e/%c/%Y %T')  " +
              "  AND  STR_TO_DATE("+connection.escape(endDate) +",'%e/%c/%Y %T') " +
              "  GROUP BY ID_ARTICOLO, DATE_FORMAT(DATA_CREAZIONE, '%d/%m/%Y');";
    connection.query(sql,function(error, results) {
        if (error) {
            gestionaleLogger.logger.error('articolifactory.getAndamentoPrezzo - Internal error: ', error);
            return cb('KO',null);
        }else {
            return cb(null,results)
        }
    });
             
}


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


articolifactory.canBeDeleted = function(id,connection,cb){
    gestionaleLogger.logger.debug('articolifactory-canBeDeleted');
    deletestr=" SELECT IF(COUNT(1) = 0,'Y','N') CAN_DELETE " +
              " FROM AN_ARTICOLI A  " +
              " 	JOIN LG_LOTTI_MAGAZZINO L ON L.ID_ARTICOLO = A.ID_ARTICOLO " +
              " 	JOIN LG_QTY_ARTICOLO Q ON Q.ID_ARTICOLO = A.ID_ARTICOLO " +
              " where A.ID_ARTICOLO= "+connection.escape(id);
    connection.query(deletestr,function(error, results) {
        if (error) {
            gestionaleLogger.logger.error('articolifactory.canBeDeleted - Internal error: ', error);
            return cb('KO',null);
        }else {
            gestionaleLogger.logger.debug("1 record inserted");
            return cb(null,results[0].CAN_DELETE=='Y')
        }
    });
};



function gestioneFiltriArticoli(filter, sql, connection){
    var retVal = sql;

    if(filter.idCategoria){
        retVal += " AND ART.ID_CATEGORIA ="+connection.escape(filter.idCategoria)+" ";
    }

    if(filter.codiceArticolo){
        retVal += " AND UPPER(ART.CODICE_ARTICOLO) LIKE concat('%', UPPER("+connection.escape(filter.codiceArticolo)+") , '%') ";
    }

    if(filter.codiceBarre){
        retVal += " AND UPPER(ART.CODICE_BARRE) LIKE concat('%', UPPER("+connection.escape(filter.codiceBarre)+") , '%') ";
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
        retVal += " AND ART.TIMER_SCADENZA_DD ="+connection.escape(filter.timerScadenza)+" ";
    }
    
    if(filter.minimoMagazzino){
       retVal += " AND ART.MINIMO_MAGAZZINO ="+connection.escape(filter.minimoMagazzino)+" ";
    }
    
    if(filter.diametro){
       retVal += " AND ART.DIAMETRO ="+connection.escape(filter.diametro)+" ";
    }
    
    if(filter.marca){
        retVal += " AND UPPER(ART.MARCA) LIKE concat('%', UPPER("+connection.escape(filter.marca)+") , '%') ";
    }

    if(filter.colore){ //id
        retVal += " AND ART.COLORE ="+connection.escape(filter.colore)+" ";
    }
    
    if(filter.peso){
        retVal += " AND ART.PESO ="+connection.escape(filter.peso)+" ";
    }
 
    if(filter.volume){
        retVal += " AND ART.VOLUME ="+connection.escape(filter.volume)+" ";
    }

    if(filter.capacita){
        retVal += " AND ART.CAPACITA ="+connection.escape(filter.capacita)+" ";
    }

    if(filter.prezzo){
        if(filter.prezzo.min && !filter.prezzo.max){
            retVal += " AND ART.PREZZO >= " + connection.escape(filter.prezzo.min);
        }else if(!filter.prezzo.min && filter.prezzo.max){
            retVal += " AND ART.PREZZO <= " + connection.escape(filter.prezzo.max);
        }else{
            retVal += " AND ( ART.PREZZO BETWEEN " + connection.escape(filter.prezzo.min) + " AND " + connection.escape(filter.prezzo.max) + " ) ";
        }
    }

    if(filter.valuta){
        retVal += " AND ART.VALUTA ="+connection.escape(filter.valuta)+" ";
    }

    if(filter.iva){
        retVal += " AND ART.IVA ="+connection.escape(filter.iva)+" "; 
    }

    if(filter.dataInserimento){
        //" ART.DATA_INS , " + 
    }

    if(filter.dataModifica){
        //" ART.DATA_MOD , " + 
    }

    if(filter.udm){
        retVal += " AND ART.UDM ="+connection.escape(filter.udm)+" "; 
    }

    if(filter.note){
        retVal += " AND UPPER(CONVERT(ART.NOTE USING UTF8)) LIKE concat('%', UPPER("+connection.escape(filter.note)+") , '%') "; 
    }

    if(filter.qty){
       if(filter.qty.min && !filter.qty.max){
            retVal += " AND (IFNULL(Q.QTY, 0) - IFNULL(Q.QTY_RISERVATA,0)) <= " + connection.escape(filter.qty.max);
       }else if(!filter.qty.min && filter.qty.max){
            retVal += " AND (IFNULL(Q.QTY, 0) - IFNULL(Q.QTY_RISERVATA,0)) >= " + connection.escape(filter.qty.min);
       }else{
            retVal += " AND ( (IFNULL(Q.QTY, 0) - IFNULL(Q.QTY_RISERVATA,0)) BETWEEN " + connection.escape(filter.qty.min) + " AND " + connection.escape(filter.qty.max) + " ) ";
       }
    }

    if(filter.magazzino){
       retVal += " AND q.ID_MAGAZZINO ="+connection.escape(filter.magazzino)+" "; 
    }
    
    return retVal;
    
    }

 
module.exports = articolifactory;
