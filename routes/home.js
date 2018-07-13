var express = require('express');
var homecontroller = require('../controller/homecontroller');
var accesscontrol = require('../security/accesscontrol');
var router = express.Router();

router.get('/alert/scadenza',accesscontrol.isLoggedIn, function(req, res,next) {
    var retObj = {};

    retObj.articoli = new Array();

    retObj.articoli.push({
        idArticolo:1,
        codiceArticolo: "aaaa",
        descrizioneArticolo: "popopopo",
        dataScadenza:"01/01/2018"
    });

    retObj.articoli.push({
        idArticolo:2,
        codiceArticolo: "cccc",
        descrizioneArticolo: "ff f f  f",
        dataScadenza:"01/02/2018"
    });

    res.end(JSON.stringify(retObj));
    
    
    /*homecontroller.getDatiAlertScadenza(req, res, function(err,data){
        if (err) return next(err);
        res.end(JSON.stringify(data));
    });*/
});

router.get('/alert/quantita',accesscontrol.isLoggedIn, function(req, res,next) {
    var retObj = {};
    
    retObj.articoli = new Array();

    retObj.articoli.push({
        idArticolo:1,
        codiceArticolo: "aaaa",
        descrizioneArticolo: "popopopo",
        qty:10
    });

    retObj.articoli.push({
        idArticolo:2,
        codiceArticolo: "cccc",
        descrizioneArticolo: "ff f f  f",
        qty:8
    });

    res.end(JSON.stringify(retObj));
    
    /*homecontroller.getDatiAlertQuantita(req, res, function(err,data){
    if (err) return next(err);
        res.end(JSON.stringify(data));
    });*/
});

module.exports = router;
