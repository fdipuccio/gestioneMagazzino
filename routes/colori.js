var express = require('express')
var router = express.Router();
var coloricontroller = require('../controller/coloricontroller');
var accesscontrol = require('../security/accesscontrol');
var gestionaleLogger = require("../utility/gestionaleLogger");


router.get('/',accesscontrol.isLoggedIn, function(req, res, next) {
    gestionaleLogger.logger.debug('colori::getAll');
    coloricontroller.getAll(req, res, function(err,data){
        if (err)  res.end(JSON.stringify(err));
        res.end(JSON.stringify(data));
    }); 
});

router.get('/:idColore',accesscontrol.isLoggedIn, function(req, res, next) {
    gestionaleLogger.logger.debug('colori::getById');
    coloricontroller.getById(req, res, function(err,data){
        if (err)  res.end(JSON.stringify(err));
        res.end(JSON.stringify(data));
    }); 
});

router.delete('/:idColore',accesscontrol.isLoggedIn, function(req, res, next) {
    gestionaleLogger.logger.debug('colori::deleteById');
    coloricontroller.deleteById(req, res, function(err,data){
        if (err)  res.end(JSON.stringify(err));
        res.end(JSON.stringify(data));
    }); 
});

router.post('/',accesscontrol.isLoggedIn, function(req, res, next) {
    gestionaleLogger.logger.debug('colori::postcolore');
    coloricontroller.postColore(req, res, function(err,data){
        if (err)  res.end(JSON.stringify(err));
        res.end(JSON.stringify(data));
    }); 
});

router.put('/:idColore',accesscontrol.isLoggedIn, function(req, res, next) {
    gestionaleLogger.logger.debug('colori::putcolore');
    coloricontroller.putColore(req, res, function(err,data){
        if (err)  res.end(JSON.stringify(err));
        res.end(JSON.stringify(data));
    }); 
});


module.exports = router;

