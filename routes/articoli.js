var express = require('express')
var router = express.Router();
var articolicontroller = require('../controller/articolicontroller');
var accesscontrol = require('../security/accesscontrol');
var gestionaleLogger = require("../utility/gestionaleLogger");



router.get('/:idArticolo(\\d+)',accesscontrol.isLoggedIn, function(req, res, next) {
    articolicontroller.getArticoloById(req, res, function(err, data){        
        if (err) return next(err);
			res.end(JSON.stringify(data));
    });
});

router.get('/disponibilita/:idArticolo(\\d+)',accesscontrol.isLoggedIn, function(req, res, next) {
    articolicontroller.getDisponibilitaArticolo(req, res, function(err, data){        
        if (err) return next(err);
			res.end(JSON.stringify(data));
    });
});


router.get('/code/:codeArticolo',accesscontrol.isLoggedIn, function(req, res, next) {
    articolicontroller.getArticoloByCode(req, res, function(err, data){        
        if (err) res.end(JSON.stringify(err));
        res.end(JSON.stringify(data));
    });
});

router.post('/search',accesscontrol.isLoggedIn, function(req, res, next) {
    articolicontroller.searchArticoli(req, res, function(err, data){        
        if (err) res.end(JSON.stringify(err));
        res.end(JSON.stringify(data));
    });
});

router.get('/categories/:idCategory',accesscontrol.isLoggedIn, function(req, res) {
    gestionaleLogger.logger.debug('articoli::search: '+req.body);
    articolicontroller.readArticoliByCategory(req, res, function(err,data){
        if (err) return next(err);
        res.end(JSON.stringify(data));
    }); 
});


router.post('/',accesscontrol.isLoggedIn, function(req, res) {
    gestionaleLogger.logger.debug('addArticolo: '+req.body);
    articolicontroller.addArticolo(req, res, function(err,data){
        if (err) res.end(JSON.stringify(err));
        res.end(JSON.stringify(data));
    });  
});


router.put('/:idArticolo',accesscontrol.isLoggedIn,  function(req, res) {
    articolicontroller.updateArticolo(req, res, function(err,data){
        gestionaleLogger.logger.debug('updateArticolo '+req.body.id);
        if (err)  res.end(JSON.stringify(err));
        res.end(JSON.stringify(data));
    });
});

router.delete('/:idArticolo',accesscontrol.isLoggedIn, function (req, res) {
    articolicontroller.deleteArticolo(req, res, function(err, data){
        if (err)  res.end(JSON.stringify(err));
        res.end(JSON.stringify(data));
    });
});


router.post('/andamentoprezzo',accesscontrol.isLoggedIn, function (req, res) {
    articolicontroller.getAndamentoPrezzo(req, res, function(err, data){
        if (err)  res.end(JSON.stringify(err));
        res.end(JSON.stringify(data));
    });
});

router.get('/caricoscarico/:idArticolo',accesscontrol.isLoggedIn, function (req, res) {
    articolicontroller.getGraficoAcArticolo(req, res, function(err, data){
        if (err)  res.end(JSON.stringify(err));
        res.end(JSON.stringify(data));
    });
});


router.get('/barcode',accesscontrol.isLoggedIn, function (req, res) {
    articolicontroller.generateBarcode(req, res, function(err, data){
        if (err)  res.end(JSON.stringify(err));
        res.end(JSON.stringify(data));
    });
});




module.exports = router;