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
                        " QS.DESCRIZIONE UDM_QTY_SCATOLA , " +
                        " ART.TIMER_SCADENZA_DD , " +
                        " ART.MINIMO_MAGAZZINO , " +
                        " ART.DIAMETRO , " +
                        " L.DESCRIZIONE UDM_DIAMETRO , " +
                        " ART.MARCA , " +
                        " CL.DESCRIZIONE COLORE , " +
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
                        " CONVERT(ART.NOTE USING UTF8) AS NOTE  " +
                        // ", " + 
                        // " Q.QTY, " + 
                        // "  q.ID_MAGAZZINO, " + 
                        // "  q.ID_QTY_MAGAZZINO   " + 
                        " FROM AN_ARTICOLI ART  " + 
                       // "   LEFT JOIN LG_QTY_ARTICOLO Q  ON Q.ID_ARTICOLO = ART.ID_ARTICOLO  " + 
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
    updtStr+=(articolo.udmLunghezza!=undefined || articolo.udmLunghezza==null)?" UDM_LUNGHEZZA ="+connection.escape(articolo.udmLunghezza)+",":"";
    updtStr+=(articolo.qtyInScatola!=undefined || articolo.qtyInScatola==null)?" QTY_SCATOLA ="+connection.escape(articolo.qtyInScatola)+",":"";
    updtStr+=(articolo.udmQtyInScatola!=undefined || articolo.udmQtyInScatola==null)?" UDM_QTY_SCATOLA ="+connection.escape(articolo.udmQtyInScatola)+",":"";
    updtStr+=(articolo.timerScadenza!=undefined || articolo.timerScadenza==null)?" TIMER_SCADENZA_DD ="+connection.escape(articolo.timerScadenza)+",":"";
    updtStr+=(articolo.minimoMagazzino!=undefined || articolo.minimoMagazzino==null)?" MINIMO_MAGAZZINO ="+connection.escape(articolo.minimoMagazzino)+",":"";
    updtStr+=(articolo.diametro!=undefined || articolo.diametro==null)?" DIAMETRO ="+connection.escape(articolo.diametro)+",":"";
    updtStr+=(articolo.udmDiametro!=undefined || articolo.udmDiametro==null)?" UDM_DIAMETRO ="+connection.escape(articolo.udmDiametro)+",":"";
    updtStr+=(articolo.marca!=undefined || articolo.marca==null)?" MARCA ="+connection.escape(articolo.marca)+",":"";
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


articolifactory.getAndamentoPrezzo = function(idArticolo, startDate, endDate, connection, cb){
    gestionaleLogger.logger.debug('articolifactory-getAndamentoPrezzo');    
    var sql = " select l.PREZZO_ACQUISTO, DATE_FORMAT(l.DATA_OPERAZIONE ,'%d/%m/%Y') DATA_OPERAZIONE " +
              "  from lg_lotti_magazzino l  " +
              "  where l.ID_ARTICOLO =  " + connection.escape(idArticolo) +
              "      and l.TIPO_OPERAZIONE = 'CARICO' " + 
              "      and  l.DATA_OPERAZIONE between STR_TO_DATE(" + connection.escape(startDate) + ",'%e/%c/%Y %T') " + 
              "      AND  STR_TO_DATE(" + connection.escape(endDate) + ",'%e/%c/%Y %T')";
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


function gestioneFiltriArticoli(filter, sql, connection){
    var retVal = sql;

    if(filter.categoria){
        retVal += " AND ART.ID_CATEGORIA ="+connection.escape(filter.categoria)+" ";
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
