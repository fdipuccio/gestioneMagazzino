var fornitorifactory = require('./fornitorifactory');
var pool = require('../connection/connection.js'); // db is pool
var gestionaleLogger = require("../utility/gestionaleLogger");

var SUPPLIERS_QUERY = " SELECT F.ID ID_FORNITORE, F.NOME, F.INDIRIZZO, F.NOTE_EXTRA_INDIRIZZO, F.PARTITA_IVA, F.CODICE_FISCALE, F.MAIL, F.TELEFONO, F.FAX, F.NOTE_FORNITORE, F.IDCOMUNE, C.NOME COMUNE, C.CAP, C.COD_PROVINCIA, C.COD_REGIONE " +
                      " FROM AN_FORNITORI F JOIN AN_COMUNI C ON C.IDCOMUNE = F.IDCOMUNE " +
                      " WHERE DELETED = 0 ";

fornitorifactory.exportSuppliers = function(suppliersFilter, connection, cb){
	return readSuppliers(suppliersFilter, connection, cb);
};



fornitorifactory.advancedSearch = function(suppliersFilter,connection,cb){
    gestionaleLogger.logger.debug('fornitorifactory::advancedSearch');        
    var supplierQuery = SUPPLIERS_QUERY;
    var filterCondition = "";
    if(suppliersFilter){
        filterCondition = makeAdvancedSearchFilterCondition(connection, suppliersFilter);
        if(filterCondition!=undefined && filterCondition!=""){
            supplierQuery += filterCondition;        
        }
    }    
    supplierQuery +=  ";"
    gestionaleLogger.logger.debug('advancedSearch',supplierQuery);
    connection.query(supplierQuery,function(err, results) {
        if (err) {
            gestionaleLogger.logger.error('fornitorifactory.advancedSearch - Internal error: ', err);
            return cb(err, null);
        }else {
            //gestionaleLogger.logger.debug('rows',results);
            return cb(null,results)
        }
    });   
};


fornitorifactory.getSupplierById = function(id, connection, cb){
    gestionaleLogger.logger.debug('fornitorifactory::getSupplierById');
    var sql =SUPPLIERS_QUERY + " AND id = "+connection.escape(id);
    gestionaleLogger.logger.debug('sql',sql);
    connection.query(sql, function (err, rows) {
        if (err){
            gestionaleLogger.logger.error('fornitorifactory.getSupplierById - Internal error: ', err);
            return cb(err, null);
        }
        else {
            gestionaleLogger.logger.debug('rows',rows);
            return cb(null,rows)
        }
    });
};																					

fornitorifactory.addSupplier = function(supplier,connection, cb){
    gestionaleLogger.logger.debug('fornitorifactory::addSupplier');
    strInsert="INSERT INTO AN_FORNITORI (NOME, INDIRIZZO, IDCOMUNE, NOTE_EXTRA_INDIRIZZO, PARTITA_IVA, CODICE_FISCALE, MAIL,TELEFONO, FAX, NOTE_FORNITORE)VALUES(?,?,?,?,?,?,?,?,?,?);";
    gestionaleLogger.logger.debug('strInsert : ',strInsert);
    connection.query(strInsert,[supplier.nome, supplier.indirizzo, supplier.idComune, supplier.noteExtraIndirizzo, supplier.partitaIva, supplier.codiceFiscale, supplier.mail,
        supplier.telefono, supplier.fax, supplier.noteFornitore],function(err, results) {
        if (err) {
            gestionaleLogger.logger.error('fornitorifactory.addSupplier - Internal error: ', err);
            return cb('KO', null);
        }else {
            gestionaleLogger.logger.debug("1 record inserted");
            return cb(null, results.insertId)
        }
    });
};

fornitorifactory.updateSupplier = function(id,fornitore, connection,cb){
    gestionaleLogger.logger.debug('fornitorifactory::updateSupplier');
    var updtStr="update an_fornitori set ";
    updtStr+=(fornitore.nome!=undefined)?" nome ="+connection.escape(fornitore.nome)+",":"''"+",";
    updtStr+=(fornitore.indirizzo!=undefined)?" indirizzo ="+connection.escape(fornitore.indirizzo)+",":"''"+",";
    updtStr+=(fornitore.idComune!=undefined)?" IDCOMUNE ="+connection.escape(fornitore.idComune)+",":"''"+",";
    updtStr+=(fornitore.noteExtraIndirizzo!=undefined || noteExtraIndirizzo==null)?" note_extra_indirizzo ="+connection.escape(fornitore.noteExtraIndirizzo)+",":"''"+",";
    updtStr+=(fornitore.partitaIva!=undefined || partitaIva==null)?" partita_iva ="+connection.escape(fornitore.partitaIva)+",":"''"+",";
    updtStr+=(fornitore.codiceFiscale!=undefined || codiceFiscale==null)?" codice_fiscale ="+connection.escape(fornitore.codiceFiscale)+",":"''"+",";
    updtStr+=(fornitore.mail!=undefined || mail==null)?" mail ="+connection.escape(fornitore.mail)+",":"''"+",";
    updtStr+=(fornitore.telefono!=undefined || telefono==null)?" telefono ="+connection.escape(fornitore.telefono)+",":"''"+",";
    updtStr+=(fornitore.fax!=undefined || fax==null)?" fax ="+connection.escape(fornitore.fax)+",":"''"+",";
    updtStr+=(fornitore.noteFornitore!=undefined || noteFornitore==null)?" note_fornitore ="+connection.escape(fornitore.noteFornitore)+",":"''"+",";
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


fornitorifactory.canBeDeleted = function(id,connection,cb){
    gestionaleLogger.logger.debug('fornitorifactory::canBeDeleted');
    deletestr="select if(count(1) = 0,'Y','N') CAN_DELETE " +
              " from an_fornitori f  " +
              "   join lg_lotti_magazzino l on l.ID_FORNITORE = f.ID " +
              " where id= "+connection.escape(id);
    connection.query(deletestr,function(err,results) {
        if (err) {
            gestionaleLogger.logger.error('fornitorifactory.canBeDeleted - Internal error: ', err);
            return cb('KO', null);
        }else {
            return cb(null, results[0].CAN_DELETE=='Y')
        }
    });
};

fornitorifactory.deleteSupplier = function(id,connection,cb){
    gestionaleLogger.logger.debug('fornitorifactory::deleteSupplier');
    deletestr="update an_fornitori set deleted = 1, DELETE_DATE = CURRENT_TIMESTAMP where id= "+connection.escape(id);
    connection.query(deletestr,function(err,results) {
        if (err) {
            gestionaleLogger.logger.error('fornitorifactory.deleteSupplier - Internal error: ', err);
            return cb('KO', null);
        }else {
            gestionaleLogger.logger.debug("deleted");
            return cb(null, 'OK')
        }
    });
};



// ######################## private functions ##############################

function makeAdvancedSearchFilterCondition(connection, filter){
    var condition = "";

    if(filter.id!=undefined){
        condition += " AND ID = " + connection.escape(filter.id);
    }
    if(filter.nome!=undefined){
        condition += " AND UPPER(F.NOME) LIKE UPPER(" + connection.escape("%"+filter.nome+"%") + ") ";
    }
    if(filter.partitaIva!=undefined){
        condition += " AND UPPER(PARTITA_IVA) LIKE UPPER(" + connection.escape("%"+filter.partitaIva+"%") + ") ";
    }
    if(filter.codiceFiscale!=undefined){
        condition += " AND UPPER(CODICE_FISCALE) LIKE UPPER(" + connection.escape("%"+filter.codiceFiscale+"%") + ")  ";
    }
    
    if(filter.indirizzo!=undefined){
        condition += " AND UPPER(INDIRIZZO) LIKE UPPER(" + connection.escape("%"+filter.indirizzo+"%") + ") ";
    }
    
    if(filter.idComune!=undefined){
        condition += " AND F.IDCOMUNE = " + connection.escape(filter.idComune);
    }
        
    if(filter.noteExtraIndirizzo!=undefined){
        condition += " AND UPPER(NOTE_EXTRA_INDIRIZZO) LIKE UPPER(" + connection.escape("%"+filter.noteExtraIndirizzo+"%") + ") ";
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
    
    if(filter.noteFornitore!=undefined){
        condition += " AND UPPER(NOTE_FORNITORE) LIKE UPPER(" + connection.escape("%"+filter.noteFornitore+"%") + ") ";
    }

    return condition;
}



module.exports = fornitorifactory;