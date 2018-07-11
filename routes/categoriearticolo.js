var express = require('express')
var router = express.Router();
var categoriearticolocontroller = require('../controller/categoriearticolocontroller');
var accesscontrol = require('../security/accesscontrol');
var gestionaleLogger = require("../utility/gestionaleLogger");


router.get('/',accesscontrol.isLoggedIn, function(req, res, next) {
    gestionaleLogger.logger.debug('categoriearticolo::getAll');
    categoriearticolocontroller.getAll(req, res, function(err,data){
        if (err) return next(err);
        res.end(JSON.stringify(data));
    }); 
});

router.get('/:idCategoria',accesscontrol.isLoggedIn, function(req, res, next) {
    gestionaleLogger.logger.debug('categoriearticolo::getById');
    categoriearticolocontroller.getById(req, res, function(err,data){
        if (err) return next(err);
        res.end(JSON.stringify(data));
    }); 
});

router.delete('/:idCategoria',accesscontrol.isLoggedIn, function(req, res, next) {
    gestionaleLogger.logger.debug('categoriearticolo::deleteById');
    categoriearticolocontroller.deleteById(req, res, function(err,data){
        if (err) return next(err);
        res.end(JSON.stringify(data));
    }); 
});

router.post('/',accesscontrol.isLoggedIn, function(req, res, next) {
    gestionaleLogger.logger.debug('categoriearticolo::postCategoria');
    categoriearticolocontroller.postCategoria(req, res, function(err,data){
        if (err) return next(err);
        res.end(JSON.stringify(data));
    }); 
});

router.put('/:idCategoria',accesscontrol.isLoggedIn, function(req, res, next) {
    gestionaleLogger.logger.debug('categoriearticolo::putCategoria');
    categoriearticolocontroller.putCategoria(req, res, function(err,data){
        if (err) return next(err);
        res.end(JSON.stringify(data));
    }); 
});


module.exports = router;

