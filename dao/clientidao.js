var clientidao = require('./clientidao')
var clientifactory = require('../factory/clientifactory')
var gestionaleLogger = require("../utility/gestionaleLogger");
var forEach = require('co-foreach');


clientidao.exportCustomers = function(customersFilter,connection, cb){
    gestionaleLogger.logger.debug('clientidao-exportCustomers');
    clientifactory.exportCustomers(customersFilter,connection, function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

clientidao.advancedSearch= function(filter,connection,cb){
    gestionaleLogger.logger.debug('clientidao-advancedSearch');
    clientifactory.advancedSearch(filter,connection, function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}


clientidao.readCustomers= function(filter,connection,cb){
    gestionaleLogger.logger.debug('clientidao-readCustomers');
    clientifactory.readCustomers(filter,connection, function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}


clientidao.getCustomerById = function(id,deleted,connection, cb){
    gestionaleLogger.logger.debug('clientidao-getUserById');
    clientifactory.getCustomerById(id,deleted,connection, function(err, data){
        if (err) return cb(err);
        return cb(null,data[0])
    });
}

clientidao.addCustomer = function(nome, indirizzo, citta, cap, provincia,
                                  nazione, note_extra_indirizzo, partita_iva, codice_fiscale, mail,
                                  telefono, fax, note_cliente, pag_x_gg_fattura, pag_x_gg_fine_mese, iva_applicata_prod, iva_applicata_serv,
                                  fatt_elettronica_pz,idModPagamentoFattura,connection,cb){
    gestionaleLogger.logger.debug('clientidao-addCustomer');
    clientifactory.addCustomer(nome, indirizzo, citta, cap, provincia,
        nazione, note_extra_indirizzo, partita_iva, codice_fiscale, mail,
        telefono, fax, note_cliente, pag_x_gg_fattura, pag_x_gg_fine_mese, iva_applicata_prod, iva_applicata_serv,
        fatt_elettronica_pz,idModPagamentoFattura, connection,function(err,data){
        return cb(err,data)
    });
}

clientidao.updateCustomer= function(id,nome, indirizzo, citta, cap, provincia,
                                  nazione, note_extra_indirizzo, partita_iva, codice_fiscale, mail,
                                  telefono, fax, note_cliente, pag_x_gg_fattura, pag_x_gg_fine_mese, iva_applicata_prod, iva_applicata_serv,
                                  fatt_elettronica_pz,idModPagamentoFattura,connection,cb){
    gestionaleLogger.logger.debug('clientidao-updateCustomer');
    clientifactory.updateCustomer(id,nome, indirizzo, citta, cap, provincia,
                                nazione, note_extra_indirizzo, partita_iva, codice_fiscale, mail,
                                telefono, fax, note_cliente, pag_x_gg_fattura, pag_x_gg_fine_mese, iva_applicata_prod, iva_applicata_serv,
                                fatt_elettronica_pz,idModPagamentoFattura,connection, function(err,data){
        return cb(err,data)
    });
}



clientidao.deleteCustomer = function(id,connection,cb){
    gestionaleLogger.logger.debug('clientidao-deleteclienti');
    clientifactory.deleteCustomer(id,connection,function(err,data){
        return cb(err,data)
    });
}


module.exports = clientidao;