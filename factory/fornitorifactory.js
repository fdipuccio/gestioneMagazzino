var fornitorifactory = require('./fornitorifactory');
var pool = require('../connection/connection.js'); // db is pool
var gestionaleLogger = require("../utility/gestionaleLogger");

var SUPPLIERS_QUERY = "SELECT SEARCH_KEY,ID, NOME, INDIRIZZO, CAP, PROVINCIA, NAZIONE, NOTE_EXTRA_INDIRIZZO,PARTITA_IVA, CODICE_FISCALE, MAIL, TELEFONO,FAX, NOTE_FORNITORE FROM vw_fornitori_home WHERE 1=1 ";
var FILTER_SUPPLIER = " AND SEARCH_KEY LIKE '%:FILTRO%' ";
var FATT_ARRAY = ["IMME","DIFF","FACC"];
var PROF_ARRAY = ["PROF"];
var DDT_ARRAY = ["DDT"];
var NDCR_ARRAY = ["NDCR"];

fornitorifactory.exportSuppliers = function(suppliersFilter, connection, cb){
	return readSuppliers(suppliersFilter, connection, cb);
};



fornitorifactory.advancedSearch = function(suppliersFilter,connection,cb){
    gestionaleLogger.logger.debug('fornitorifactory::advancedSearch');        
    var supplierQuery = SUPPLIERS_QUERY;
    var filterCondition = makeAdvancedSearchFilterCondition(connection, suppliersFilter);
    if(filterCondition!=undefined && filterCondition!=""){
        supplierQuery += filterCondition;        
    }
    supplierQuery +=  ";"
    gestionaleLogger.logger.debug('advancedSearch',supplierQuery);
    connection.query(supplierQuery,function(err, results) {
        if (err) {
            gestionaleLogger.logger.error('fornitorifactory.advancedSearch - Internal error: ', err);
            return cb(err);
        }else {
            //gestionaleLogger.logger.debug('rows',results);
            return cb(null,results)
        }
    });   
};

fornitorifactory.readSuppliers = function(suppliersFilter,connection,cb){
    gestionaleLogger.logger.debug('fornitorifactory::readSuppliers');
    var suppliersQuery = SUPPLIERS_QUERY;
    var filterCondition = makeSupplierFilterCondition(connection, suppliersFilter);
   if(filterCondition!=undefined){
        suppliersQuery += filterCondition;        
    }
    suppliersQuery +=  ";"
    gestionaleLogger.logger.debug('readSuppliersQuery',suppliersQuery);
    connection.query(suppliersQuery,function(err, results) {
        if (err) {
            gestionaleLogger.logger.error('fornitorifactory.readSuppliers - Internal error: ', err);
            return cb(err);
        }else {
            return cb(null,results)
        }
    });
};

fornitorifactory.getSupplierById = function(id, connection, cb){
    gestionaleLogger.logger.debug('fornitorifactory::getSupplierById');
    var sql ='SELECT * FROM VW_FORNITORI_HOME where  id = '+connection.escape(id);
    gestionaleLogger.logger.debug('sql',sql);
    connection.query(sql, function (err, rows) {
        if (err){
            gestionaleLogger.logger.error('fornitorifactory.getSupplierById - Internal error: ', err);
            return cb(err);
        }
        else {
            gestionaleLogger.logger.debug('rows',rows);
            return cb(null,rows)
        }
    });
};																					

fornitorifactory.addSupplier = function(supplier,connection, cb){
    gestionaleLogger.logger.debug('fornitorifactory::addSupplier');
    strInsert="INSERT INTO AN_FORNITORI (NOME, INDIRIZZO, CITTA, CAP, PROVINCIA,NAZIONE, NOTE_EXTRA_INDIRIZZO, PARTITA_IVA, CODICE_FISCALE, MAIL,TELEFONO, FAX, NOTE_FORNITORE)VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?);";
    gestionaleLogger.logger.debug('strInsert : ',strInsert);
    connection.query(strInsert,[supplier.nome, supplier.indirizzo, supplier.citta, supplier.cap, supplier.provincia,
        supplier.nazione, supplier.note_extra_indirizzo, supplier.partita_iva, supplier.codice_fiscale, supplier.mail,
        supplier.telefono, supplier.fax, supplier.note_fornitore],function(err, results) {
        if (err) {
            gestionaleLogger.logger.error('fornitorifactory.addSupplier - Internal error: ', err);
            return cb('KO');
        }else {
            gestionaleLogger.logger.debug("1 record inserted");
            return cb(null, results.insertId)
        }
    });
};

fornitorifactory.updateSupplier = function(id, nome, indirizzo, citta, cap, provincia,
										nazione, note_extra_indirizzo, partita_iva, codice_fiscale, mail,
										telefono, fax, note_fornitore, connection,cb){
    gestionaleLogger.logger.debug('fornitorifactory::updateSupplier');
    var updtStr="update an_fornitori set ";
    updtStr+=(nome!=undefined)?" nome ="+connection.escape(nome)+",":"''"+",";
    updtStr+=(indirizzo!=undefined)?" indirizzo ="+connection.escape(indirizzo)+",":"''"+",";
    updtStr+=(citta!=undefined)?" citta ="+connection.escape(citta)+",":"''"+",";
    updtStr+=(cap!=undefined)?" cap ="+connection.escape(cap)+",":"''"+",";
    updtStr+=(provincia!=undefined)?" provincia ="+connection.escape(provincia)+",":"''"+",";
    updtStr+=(nazione!=undefined || nazione==null)?" nazione ="+connection.escape(nazione)+",":"''"+",";
    updtStr+=(note_extra_indirizzo!=undefined || note_extra_indirizzo==null)?" note_extra_indirizzo ="+connection.escape(note_extra_indirizzo)+",":"''"+",";
    updtStr+=(partita_iva!=undefined || partita_iva==null)?" partita_iva ="+connection.escape(partita_iva)+",":"''"+",";
    updtStr+=(codice_fiscale!=undefined || codice_fiscale==null)?" codice_fiscale ="+connection.escape(codice_fiscale)+",":"''"+",";
    updtStr+=(mail!=undefined || mail==null)?" mail ="+connection.escape(mail)+",":"''"+",";
    updtStr+=(telefono!=undefined || telefono==null)?" telefono ="+connection.escape(telefono)+",":"''"+",";
    updtStr+=(fax!=undefined || fax==null)?" fax ="+connection.escape(fax)+",":"''"+",";
    updtStr+=(note_fornitore!=undefined || note_fornitore==null)?" note_fornitore ="+connection.escape(note_fornitore)+",":"''"+",";
    updtStr= updtStr.substring(0, updtStr.length - 1);// elimino l'ultima vigola :)
    updtStr+= " where id ="+connection.escape(id);
    gestionaleLogger.logger.debug('updtStr',updtStr);

    connection.query(updtStr,function(err, results) {
        if (err) {
            gestionaleLogger.logger.error('fornitorifactory.updateSupplier - Internal error: ', err);
            return cb('KO',null);
        }else {
            gestionaleLogger.logger.debug("Update done");
            return cb(null,'OK')
        }
    });
};

fornitorifactory.deleteSupplier = function(id,connection,cb){
    gestionaleLogger.logger.debug('fornitorifactory::deleteSupplier');
    deletestr="update an_fornitori set deleted = 1, DELETE_DATE = CURRENT_TIMESTAMP where id= "+connection.escape(id);
    connection.query(deletestr,function(err,results) {
        if (err) {
            gestionaleLogger.logger.error('fornitorifactory.deleteSupplier - Internal error: ', err);
            return cb('KO');
        }else {
            gestionaleLogger.logger.debug("deleted");
            return cb('OK')
        }
    });
};



// ######################## private functions ##############################

function makeAdvancedSearchFilterCondition(connection, filter){
    var condition = "";


    if(filter.searchkey!=undefined){
        condition += " AND ( " + 
                            " UPPER(NOME) LIKE UPPER(" + connection.escape("%"+filter.searchkey+"%") + ") OR " +
                            " UPPER(PARTITA_IVA) LIKE UPPER(" + connection.escape("%"+filter.searchkey+"%") + ") OR " +
                            " UPPER(CODICE_FISCALE) LIKE UPPER(" + connection.escape("%"+filter.searchkey+"%") + ") " +
                            ") ";
    }
    
    if(filter.indirizzo!=undefined){
        condition += " AND UPPER(INDIRIZZO) LIKE UPPER(%" + connection.escape("%"+filter.indirizzo+"%") + ") ";
    }
    
    if(filter.citta!=undefined){
        condition += " AND UPPER(CITTA) LIKE UPPER(" + connection.escape("%"+filter.citta+"%") + ") ";
    }
    
    if(filter.cap!=undefined){
        condition += " AND UPPER(CAP) LIKE UPPER(" + connection.escape("%"+filter.cap+"%") + ") ";
    }
    
    if(filter.provincia!=undefined){
        condition += " AND UPPER(PROVINCIA) LIKE UPPER(" + connection.escape("%"+filter.provincia+"%") + ") ";
    }
    
    if(filter.nazione!=undefined){
        condition += " AND UPPER(NAZIONE) LIKE UPPER(" + connection.escape("%"+filter.nazione+"%") + ") ";
    }
    
    if(filter.note_extra_indirizzo!=undefined){
        condition += " AND UPPER(NOTE_EXTRA_INDIRIZZO) LIKE UPPER(" + connection.escape("%"+filter.note_extra_indirizzo+"%") + ") ";
    }
    
    if(filter.mail!=undefined){
        condition += " AND UPPER(MAIL) LIKE UPPER(" + connection.escape("%"+filter.mail+"%") + ") ";
    }

    if(filter.telefono!=undefined){
        condition += " AND UPPER(TELEFONO) LIKE UPPER(" + connection.escape("%"+filter.telefono+"%") + ") ";
    }
    
    if(filter.fax!=undefined){
        condition += " AND UPPER(FAX) LIKE UPPER(" + connection.escape("%"+filter.fax+"%") + ") ";
    }
    
    if(filter.note_fornitore!=undefined){
        condition += " AND UPPER(NOTE_FORNITORE) LIKE UPPER(" + connection.escape("%"+filter.note_fornitore+"%") + ") ";
    }

    return condition;
}


function makeSupplierFilterCondition(connection, filter){
    var condition = "";
    
        if(filter.id!=undefined){
            condition += " AND ID = " + connection.escape(filter.id) + " ";
        }
    
        if(filter.nome!=undefined){
            condition += " AND NOME = " + connection.escape(filter.nome) + " ";
        }
        
        if(filter.indirizzo!=undefined){
            condition += " AND INDIRIZZO = " + connection.escape(filter.indirizzo) + " ";
        }
        
        if(filter.citta!=undefined){
            condition += " AND CITTA = " + connection.escape(filter.citta) + " ";
        }
        
        if(filter.cap!=undefined){
            condition += " AND CAP = " + connection.escape(filter.cap) + " ";
        }
        
        if(filter.provincia!=undefined){
            condition += " AND PROVINCIA = " + connection.escape(filter.provincia) + " ";
        }
        
        if(filter.nazione!=undefined){
            condition += " AND NAZIONE = " + connection.escape(filter.nazione) + " ";
        }
        
        if(filter.note_extra_indirizzo!=undefined){
            condition += " AND NOTE_EXTRA_INDIRIZZO = " + connection.escape(filter.note_extra_indirizzo) + " ";
        }
    
        if(filter.partita_iva!=undefined){
            condition += " AND PARTITA_IVA = " + connection.escape(filter.partita_iva) + " ";
        }
        
        if(filter.codice_fiscale!=undefined){
            condition += " AND CODICE_FISCALE = " + connection.escape(filter.codice_fiscale) + " ";
        }
    
        if(filter.mail!=undefined){
            condition += " AND MAIL = " + connection.escape(filter.mail) + " ";
        }
    
        if(filter.telefono!=undefined){
            condition += " AND TELEFONO = " + connection.escape(filter.telefono) + " ";
        }
        
        if(filter.fax!=undefined){
            condition += " AND FAX = " + connection.escape(filter.fax) + " ";
        }
        
        if(filter.note_fornitore!=undefined){
            condition += " AND NOTE_FORNITORE = " + connection.escape(filter.note_fornitore) + " ";
        }
    
        return condition;
}


fornitorifactory.checkNumeroFattura = function( idFornitore ,fattura, connection, cb){
    gestionaleLogger.logger.debug('fornitorifactory::checkNumeroFattura');
    var tipiFattura = new Array();
    var tipoFattura = fattura.tipoFattura;
    var sql = "SELECT count(1) numero FROM co_fatture WHERE ID_FORNITORE = " 
    + connection.escape(idFornitore) +" AND ANNO_RIF = " 
    + connection.escape(fattura.anno)
    +" AND NUMERO = " + connection.escape(fattura.numero);
    
    switch(tipoFattura){
        case 'IMME':
        case 'DIFF':
        case 'FACC':
            tipiFattura = FATT_ARRAY;
        break;
        case 'PROF':
            tipiFattura = PROF_ARRAY;
        break;
        case 'DDT':
            tipiFattura = DDT_ARRAY;
        break;
        case 'NDCR':
            tipiFattura = NDCR_ARRAY;
        break;

    }

    sql +=" AND TIPO_FATTURA IN ( ";    
    for(var tf in tipiFattura){
        sql += connection.escape(tipiFattura[tf])+",";
    }
    sql= sql.substring(0, sql.length - 1);// elimino l'ultima vigola :)
    sql += ") ";

    connection.query(sql,function(err, results) {
        if (err) {
            gestionaleLogger.logger.error('fornitorifactory.checkNumeroFattura - Internal error: ', err);
            return cb('KO', null);
        }else {
            return cb(null, results[0].numero>0);
        }
    });
};

module.exports = fornitorifactory;