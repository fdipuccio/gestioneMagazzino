var clientifactory = require('./clientifactory');
var CUSTOMER_QUERY = "SELECT CLI.SEARCH_KEY,CLI.ID, CLI.NOME, CLI.INDIRIZZO, CLI.CAP, CLI.PROVINCIA,CLI.CITTA, CLI.NAZIONE, CLI.NOTE_EXTRA_INDIRIZZO,CLI.PARTITA_IVA, CLI.CODICE_FISCALE, CLI.MAIL, CLI.TELEFONO, CLI.FAX, CLI.NOTE_CLIENTE, CLI.PAG_X_GG_FATTURA, CLI.PAG_X_GG_FINE_MESE, CLI.IVA_APPLICATA_PROD, cli.IVA_APPLICATA_SERV, CLI.FATT_ELETTRONICA_PZ, CLI.ID_MOD_PAGAMENTO, CLI.ANNOTAZIONE_OP_NON_IMPONIBILE FROM VW_CLIENTI_HOME CLI  WHERE 1 = 1";
var FILTER_CUSTOMER = " AND CLI.NOME LIKE '%:FILTRO%' OR CLI.CODICE_FISCALE LIKE '%:FILTRO%' OR CLI.PARTITA_IVA  LIKE '%:FILTRO%' ";
var gestionaleLogger = require("../utility/gestionaleLogger");


// Customer Account Table Section

clientifactory.exportCustomers = function( customersFilter,connection,cb){
	return readCustomers(customersFilter,connection,cb);
};



clientifactory.advancedSearch = function(customersFilter,connection,cb){
    gestionaleLogger.logger.debug('clientifactory::advancedSearch');        
    var customerQuery = CUSTOMER_QUERY;
    var filterCondition = makeAdvancedSearchFilterCondition(connection, customersFilter);
    if(filterCondition!=undefined && filterCondition!=""){
        customerQuery += filterCondition;        
    }
    customerQuery +=  ";"
    gestionaleLogger.logger.debug('readCustomerQuery',customerQuery);
    connection.query(customerQuery,function(err, results) {
        if (err) {
            gestionaleLogger.logger.error('clientifactory.advancedSearch - Internal error: ', err);
            return cb(err);
        }else {
            //gestionaleLogger.logger.debug('rows',results);
            return cb(null,results)
        }
    });   
};


clientifactory.readCustomers = function(customersFilter,connection,cb){
    gestionaleLogger.logger.debug('clientifactory::readCustomers');        
    var customerQuery = CUSTOMER_QUERY;
    var filterCondition = makeCustomerFilterCondition(connection, customersFilter);
    if(filterCondition!=undefined){
        customerQuery += filterCondition;        
    }
    customerQuery +=  ";"
    gestionaleLogger.logger.debug('readCustomerQuery',customerQuery);
    connection.query(customerQuery,function(err, results) {
        if (err) {
            gestionaleLogger.logger.error('clientifactory.readCustomers - Internal error: ', err);
            return cb(err, null);
        }else {
            //gestionaleLogger.logger.debug('rows',results);
            return cb(null,results)
        }
    });   
};


clientifactory.getCustomerById = function(id,deleted,connection, cb){
    gestionaleLogger.logger.debug('clientifactory::getCustomerById');
    var sql =" SELECT 	CONCAT(NOME, CODICE_FISCALE, PARTITA_IVA) SEARCH_KEY, " +
            "       ID, NOME, INDIRIZZO, CITTA, CAP, PROVINCIA, NAZIONE, NOTE_EXTRA_INDIRIZZO, " +
            "       PARTITA_IVA, CODICE_FISCALE, MAIL, TELEFONO, " +
            "       FAX, NOTE_CLIENTE, PAG_X_GG_FATTURA, PAG_X_GG_FINE_MESE, " + 
            "       IVAP.CODICE IVA_APPLICATA_PROD,IVAS.CODICE IVA_APPLICATA_SERV,  " +
            "       IVAP.VALORE IVA_APPLICATA_PROD_VAL,IVAS.VALORE IVA_APPLICATA_SERV_VAL,  " +
            "       FATT_ELETTRONICA_PZ, CLI.ID_MOD_PAGAMENTO, CLI.ANNOTAZIONE_OP_NON_IMPONIBILE " +
            " FROM AN_CLIENTI CLI LEFT JOIN AN_IVA_APPLICATA IVAP ON CLI.IVA_APPLICATA_SERV = IVAP.CODICE " +
            "   LEFT JOIN AN_IVA_APPLICATA IVAS ON CLI.IVA_APPLICATA_PROD = IVAS.CODICE where  id = "+connection.escape(id);
    
    if(!deleted){
        sql += " AND DELETED = 0 "
    }
    gestionaleLogger.logger.debug('sql',sql);
    connection.query(sql, function (err, rows) {
        if (err){
            gestionaleLogger.logger.error('clientifactory.getCustomerById - Internal error: ', err);
            return cb(err, null);
        }
        else {
            //gestionaleLogger.logger.debug('rows',rows);
            return cb(null,rows)
        }
    });   
};

clientifactory.addCustomer = function(nome, indirizzo, citta, cap, provincia,
										nazione, note_extra_indirizzo, partita_iva, codice_fiscale, mail,
										telefono, fax, note_cliente, pag_x_gg_fattura, pag_x_gg_fine_mese, iva_applicata_prod, iva_applicata_serv,
										fatt_elettronica_pz,idModPagamentoFatture,connection, cb){
    gestionaleLogger.logger.debug('clientifactory::addCustomer');
    strInsert="INSERT INTO AN_CLIENTI (NOME, INDIRIZZO, CITTA, CAP, PROVINCIA,NAZIONE, NOTE_EXTRA_INDIRIZZO, PARTITA_IVA, CODICE_FISCALE, MAIL,TELEFONO, FAX, NOTE_CLIENTE, PAG_X_GG_FATTURA, PAG_X_GG_FINE_MESE, IVA_APPLICATA_PROD, IVA_APPLICATA_SERV ,FATT_ELETTRONICA_PZ,ID_MOD_PAGAMENTO) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);";
    gestionaleLogger.logger.debug('strInsert : ',strInsert);
    connection.query(strInsert,[nome, indirizzo, citta, cap, provincia,
                                    nazione, note_extra_indirizzo, partita_iva, codice_fiscale, mail,
                                    telefono, fax, note_cliente, pag_x_gg_fattura, pag_x_gg_fine_mese, iva_applicata_prod, iva_applicata_serv,
                                    fatt_elettronica_pz,idModPagamentoFatture],function(error,results) {
        if (error) {
            gestionaleLogger.logger.error('clientifactory.getCustomerById - Internal error: ', error);
            return cb('KO', null);
        }else {
            gestionaleLogger.logger.debug("1 record inserted");
            var retObj = {};
            retObj.id=results.insertId;
            return cb(null, retObj)
        }
    });
};

clientifactory.updateCustomer = function(id, nome, indirizzo, citta, cap, provincia,
										nazione, note_extra_indirizzo, partita_iva, codice_fiscale, mail,
										telefono, fax, note_cliente, pag_x_gg_fattura, pag_x_gg_fine_mese, iva_applicata_prod, iva_applicata_serv,
										fatt_elettronica_pz,idModPagamentoFattura,connection, cb){
    gestionaleLogger.logger.debug('clientifactory::updateCustomer');
    var updtStr="update an_clienti set ";
    updtStr+=(nome!=undefined)?" nome ="+connection.escape(nome)+",":"";
    updtStr+=(indirizzo!=undefined )?" indirizzo ="+connection.escape(indirizzo)+",":"";
    updtStr+=(citta!=undefined)?" citta ="+connection.escape(citta)+",":"";
    updtStr+=(cap!=undefined )?" cap ="+connection.escape(cap)+",":"";
    updtStr+=(provincia!=undefined )?" provincia ="+connection.escape(provincia)+",":"";
    updtStr+=(nazione!=undefined )?" nazione ="+connection.escape(nazione)+",":"";
    updtStr+=(note_extra_indirizzo!=undefined || note_extra_indirizzo==null)?" note_extra_indirizzo ="+connection.escape(note_extra_indirizzo)+",":"";
    updtStr+=(partita_iva!=undefined || partita_iva==null)?" partita_iva ="+connection.escape(partita_iva)+",":"";
    updtStr+=(codice_fiscale!=undefined || codice_fiscale==null)?" codice_fiscale ="+connection.escape(codice_fiscale)+",":"";
    updtStr+=(mail!=undefined || mail==null)?" mail ="+connection.escape(mail)+",":"";
    updtStr+=(telefono!=undefined || telefono==null)?" telefono ="+connection.escape(telefono)+",":"";
    updtStr+=(fax!=undefined || fax==null)?" fax ="+connection.escape(fax)+",":"";
    updtStr+=(note_cliente!=undefined || note_cliente==null)?" note_cliente ="+connection.escape(note_cliente)+",":"";
    updtStr+=(pag_x_gg_fattura!=undefined || pag_x_gg_fattura==null)?" pag_x_gg_fattura ="+connection.escape(pag_x_gg_fattura)+",":"";
    updtStr+=(pag_x_gg_fine_mese!=undefined || pag_x_gg_fine_mese==null)?" pag_x_gg_fine_mese ="+connection.escape(pag_x_gg_fine_mese)+",":"";
    updtStr+=(iva_applicata_prod!=undefined || iva_applicata_prod==null)?" IVA_APPLICATA_PROD ="+connection.escape(iva_applicata_prod)+",":"";
    updtStr+=(iva_applicata_serv!=undefined || iva_applicata_serv==null)?" IVA_APPLICATA_SERV ="+connection.escape(iva_applicata_serv)+",":"";
    updtStr+=(fatt_elettronica_pz!=undefined || fatt_elettronica_pz==null)?" fatt_elettronica_pz ="+connection.escape(fatt_elettronica_pz)+",":"";
    updtStr+=(idModPagamentoFattura!=undefined || idModPagamentoFattura==null)?" ID_MOD_PAGAMENTO ="+connection.escape(idModPagamentoFattura)+",":"";
    updtStr= updtStr.substring(0, updtStr.length - 1);// elimino l'ultima vigola :)
    updtStr+= " where id ="+connection.escape(id);
    gestionaleLogger.logger.debug('updtStr',updtStr);

    connection.query(updtStr,function(err,results) {
        if (err) {
            gestionaleLogger.logger.error('clientifactory.updateCustomer - Internal error: ', err);
            return cb('KO',null);
        }else {
            gestionaleLogger.logger.debug("Update done");
            return cb(null,results)
        }
    });
};

clientifactory.deleteCustomer = function(id,connection,cb){
    gestionaleLogger.logger.debug('clientifactory::deleteCustomer');
    deletestr="update an_clienti set deleted = 1, DELETE_DATE = CURRENT_TIMESTAMP where id= "+connection.escape(id);
    connection.query(deletestr,function(error, results) {
        if (error) {
            gestionaleLogger.logger.error('clientifactory.deleteCustomer - Internal error: ', error);
            return cb('KO',null);
        }else {
            gestionaleLogger.logger.debug("1 record inserted");
            return cb(null,results)
        }
    });
};


/////////////////////// PRIVATE FUNCTIONS ///////////////////////////////


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
    
    if(filter.note_cliente!=undefined){
        condition += " AND UPPER(NOTE_CLIENTE) LIKE UPPER(" + connection.escape("%"+filter.note_cliente+"%") + ") ";
    }

    return condition;
}


function makeCustomerFilterCondition(connection, filter){
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
    
    if(filter.note_cliente!=undefined){
        condition += " AND NOTE_CLIENTE = " + connection.escape(filter.note_cliente) + " ";
    }

    /*
    filter.note_cliente=req.body.note_cliente;
    filter.pag_x_gg_fattura=req.body.pag_x_gg_fattura;
    filter.pag_x_gg_fine_mese=req.body.pag_x_gg_fine_mese;
    filter.iva_applicata=req.body.iva_applicata;
    filter.fatt_elettronica_pz=req.body.fatt_elettronica_pz;*/

    return condition;
}



module.exports = clientifactory;