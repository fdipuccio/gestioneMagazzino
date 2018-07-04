'use strict';
var clienticontroller = require('./clienticontroller');
var clientiservice = require('../service/clientiservice')
var gestionaleLogger = require("../utility/gestionaleLogger");

clienticontroller.getCustomerById = function(req, res, cb){
    gestionaleLogger.logger.debug('clienticontroller- getUserById');
    clientiservice.getCustomerById(req.params.idcliente, req.query.deleted, function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}


clienticontroller.addCustomer = function(req, res, cb){
	gestionaleLogger.logger.debug('addclienti- controller');
    var contoCliente = req.body.conto;  
    var nome=req.body.nome;
	var indirizzo=req.body.indirizzo;
	var citta=req.body.citta;
	var cap=req.body.cap;
	var provincia=req.body.provincia;
	var nazione=req.body.nazione;
	var note_extra_indirizzo=req.body.note_extra_indirizzo;
	var partita_iva=req.body.partita_iva;
	var codice_fiscale=req.body.codice_fiscale;
	var mail=req.body.mail;
	var telefono=req.body.telefono;
	var fax=req.body.fax;
	var note_cliente=req.body.note_cliente;
	var pag_x_gg_fattura=req.body.pag_x_gg_fattura;
	var pag_x_gg_fine_mese=req.body.pag_x_gg_fine_mese;
    var iva_applicata=req.body.iva_applicata;
    var iva_applicata_prod=req.body.iva_applicata_prod;
    var iva_applicata_serv=req.body.iva_applicata_serv;
    var fatt_elettronica_pz=req.body.fatt_elettronica_pz;
    var idModPagamentoFattura=req.body.idModPagamentoFattura;
    
    clientiservice.addCustomer(nome, indirizzo, citta, cap, provincia,
          nazione, note_extra_indirizzo, partita_iva, codice_fiscale, mail,
          telefono, fax, note_cliente, pag_x_gg_fattura, pag_x_gg_fine_mese, iva_applicata_prod, iva_applicata_serv,
          fatt_elettronica_pz,idModPagamentoFattura,contoCliente, function(err,data){
			return cb(err,data)
        });
}


clienticontroller.updateCustomer = function(req, res, cb){
    gestionaleLogger.logger.debug('updateCustomer- controller');
    var id=req.params.idcliente;
    var nome=req.body.nome;
    var indirizzo=req.body.indirizzo;
    var citta=req.body.citta;
    var cap=req.body.cap;
    var provincia=req.body.provincia;
    var nazione=req.body.nazione;
    var note_extra_indirizzo=req.body.note_extra_indirizzo;
    var partita_iva=req.body.partita_iva;
    var codice_fiscale=req.body.codice_fiscale;
    var mail=req.body.mail;
    var telefono=req.body.telefono;
    var fax=req.body.fax;
    var note_cliente=req.body.note_cliente;
    var pag_x_gg_fattura=req.body.pag_x_gg_fattura;
    var pag_x_gg_fine_mese=req.body.pag_x_gg_fine_mese;
    var iva_applicata_prod=req.body.iva_applicata_prod;
    var iva_applicata_serv=req.body.iva_applicata_serv;
    var fatt_elettronica_pz=req.body.fatt_elettronica_pz;
    var idModPagamentoFattura = req.body.idModPagamentoFattura;

    clientiservice.updateCustomer(id,nome, indirizzo, citta, cap, provincia,
        nazione, note_extra_indirizzo, partita_iva, codice_fiscale, mail,
        telefono, fax, note_cliente, pag_x_gg_fattura, pag_x_gg_fine_mese, iva_applicata_prod, iva_applicata_serv,
        fatt_elettronica_pz,idModPagamentoFattura, function(err,data){
            return cb(err,data)
        });
}




clienticontroller.deleteCustomer = function(req, res, cb){
	gestionaleLogger.logger.debug('deleteclienti- controller');
	  clientiservice.deleteCustomer(req.params.idcliente,function(err, data){
            if(err && err.code == 'CL100'){
                //res.status(409);
            }
            return cb(err, data)
        });
}


clienticontroller.advancedSearch = function(req, res, cb){
    gestionaleLogger.logger.debug('advancedSearch- controller');
    var filter={};

    filter.searchkey=req.body.filter.searchkey;
    filter.indirizzo=req.body.filter.indirizzo;
    filter.citta=req.body.filter.citta;
    filter.cap=req.body.filter.cap;
    filter.provincia=req.body.filter.provincia;
    filter.nazione=req.body.filter.nazione;
    filter.note_extra_indirizzo=req.body.filter.note_extra_indirizzo;
    filter.mail=req.body.filter.mail;
    filter.telefono=req.body.filter.telefono;
    filter.fax=req.body.filter.fax;
    filter.note_cliente=req.body.filter.note_cliente;
    
    clientiservice.advancedSearch(filter, function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });

}

clienticontroller.readCustomers = function(req, res, cb){
    gestionaleLogger.logger.debug('readCustomers- controller');
    var filter={};

    filter.id=req.body.id;
    filter.nome=req.body.nome;
    filter.indirizzo=req.body.indirizzo;
    filter.citta=req.body.citta;
    filter.cap=req.body.cap;
    filter.provincia=req.body.provincia;
    filter.nazione=req.body.nazione;
    filter.note_extra_indirizzo=req.body.note_extra_indirizzo;
    filter.partita_iva=req.body.partita_iva;
    filter.codice_fiscale=req.body.codice_fiscale;
    filter.mail=req.body.mail;
    filter.telefono=req.body.telefono;
    filter.fax=req.body.fax;
    filter.note_cliente=req.body.note_cliente;
    filter.pag_x_gg_fattura=req.body.pag_x_gg_fattura;
    filter.pag_x_gg_fine_mese=req.body.pag_x_gg_fine_mese;
    filter.iva_applicata=req.body.iva_applicata;
    filter.fatt_elettronica_pz=req.body.fatt_elettronica_pz;

    clientiservice.readCustomers(filter, function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });

}


module.exports = clienticontroller;
