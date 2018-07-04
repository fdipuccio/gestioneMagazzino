'use strict';
var fornitoricontroller = require('./fornitoricontroller');
var fornitoriservice = require('../service/fornitoriservice')
var gestionaleLogger = require("../utility/gestionaleLogger");


fornitoricontroller.getSupplierById = function (req, res, cb) {
    gestionaleLogger.logger.debug('fornitoricontroller- getSupplierById');

    fornitoriservice.getSupplierById(req.params.idSupplier, function (err, data) {
        if (err) return cb(err);
        return cb(null, data)
    });
}

fornitoricontroller.addSupplier = function (req, res, cb) {

    gestionaleLogger.logger.debug('addSupplier- controller');

    var supplier = {};

    supplier.nome = req.body.nome;
    supplier.indirizzo = req.body.indirizzo;
    supplier.citta = req.body.citta;
    supplier.cap = req.body.cap;
    supplier.provincia = req.body.provincia;
    supplier.nazione = req.body.nazione;
    supplier.note_extra_indirizzo = req.body.note_extra_indirizzo;
    supplier.partita_iva = req.body.partita_iva;
    supplier.codice_fiscale = req.body.codice_fiscale;
    supplier.mail = req.body.mail;
    supplier.telefono = req.body.telefono;
    supplier.fax = req.body.fax;
    supplier.note_fornitore = req.body.note_fornitore;

    fornitoriservice.addSupplier(supplier, function (err, data) {
        return cb(err, data)
    });
}


fornitoricontroller.updateSupplier = function (req, res, cb) {

    gestionaleLogger.logger.debug('updateSupplier- controller');
    var id=req.params.idSupplier;
    var updateSupplier = {};
	updateSupplier.id =id;
    updateSupplier.nome = req.body.nome;
    updateSupplier.indirizzo = req.body.indirizzo;
    updateSupplier.citta = req.body.citta;
    updateSupplier.cap = req.body.cap;
    updateSupplier.provincia = req.body.provincia;
    updateSupplier.nazione = req.body.nazione;
    updateSupplier.note_extra_indirizzo = req.body.note_extra_indirizzo;
    updateSupplier.partita_iva = req.body.partita_iva;
    updateSupplier.codice_fiscale = req.body.codice_fiscale;
    updateSupplier.mail = req.body.mail;
    updateSupplier.telefono = req.body.telefono;
    updateSupplier.fax = req.body.fax;
    updateSupplier.note_fornitore = req.body.note_fornitore;


    fornitoriservice.updateSupplier(updateSupplier.id, updateSupplier.nome, updateSupplier.indirizzo, updateSupplier.citta, updateSupplier.cap, updateSupplier.provincia,
        updateSupplier.nazione, updateSupplier.note_extra_indirizzo, updateSupplier.partita_iva, updateSupplier.codice_fiscale, updateSupplier.mail,
        updateSupplier.telefono, updateSupplier.fax, updateSupplier.note_fornitore, function (err,data) {
        return cb(err,data)
    });
}



fornitoricontroller.advancedSearch = function(req, res, cb){
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
    filter.note_fornitore=req.body.filter.note_fornitore;
    
    fornitoriservice.advancedSearch(filter, function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });

}

fornitoricontroller.deleteSupplier = function (req, res, cb) {
    gestionaleLogger.logger.debug('deleteSupplier- controller');
    fornitoriservice.deleteSupplier(req.params.idSupplier, function (err, data) {
        return cb(err, data)
    });
}


fornitoricontroller.readSuppliers = function (req, res, cb) {

    gestionaleLogger.logger.debug('readSuppliers- controller');
    var supplierFilter = {};
    supplierFilter.nome = req.body.nome;
    supplierFilter.indirizzo = req.body.indirizzo;
    supplierFilter.citta = req.body.citta;
    supplierFilter.cap = req.body.cap;
    supplierFilter.provincia = req.body.provincia;
    supplierFilter.nazione = req.body.nazione;
    supplierFilter.note_extra_indirizzo = req.body.note_extra_indirizzo;
    supplierFilter.partita_iva = req.body.partita_iva;
    supplierFilter.codice_fiscale = req.body.codice_fiscale;
    supplierFilter.mail = req.body.mail;
    supplierFilter.telefono = req.body.telefono;
    supplierFilter.fax = req.body.fax;
    supplierFilter.note_fornitore = req.body.note_fornitore;


    fornitoriservice.readSuppliers(supplierFilter, function (err, data) {
        if (err) return cb(err);
        return cb(null, data)
    });
}


module.exports = fornitoricontroller;
