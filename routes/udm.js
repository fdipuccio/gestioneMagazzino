var express = require('express')
var router = express.Router();
var udmcontroller = require('../controller/udmcontroller');
var accesscontrol = require('../security/accesscontrol');
var gestionaleLogger = require("../utility/gestionaleLogger");


router.get('/',accesscontrol.isLoggedIn, function(req, res, next) {
  udmcontroller.getUdms(req, res, function(err, data){
          if (err) return next(err);
			res.end(JSON.stringify(data));
        });
});

router.get('/:idUdm(\w{2})',accesscontrol.isLoggedIn, function(req, res, next) {
    udmcontroller.getUdmById(req, res, function(err, data){
        if (err) return next(err);
        res.end(JSON.stringify(data));
    });
});

router.get('/volume',accesscontrol.isLoggedIn, function(req, res, next) {
    udmcontroller.getVolumeUdms(req, res, function(err, data){
        if (err) return next(err);
        res.end(JSON.stringify(data));
    });
});

router.get('/peso',accesscontrol.isLoggedIn, function(req, res, next) {
    udmcontroller.getPesoUdms(req, res, function(err, data){
        if (err) return next(err);
        res.end(JSON.stringify(data));
    });
});

router.get('/qtyscatola',accesscontrol.isLoggedIn, function(req, res, next) {
    udmcontroller.getQtyScatolaUdms(req, res, function(err, data){
        if (err) return next(err);
        res.end(JSON.stringify(data));
    });
});

router.get('/lunghezza',accesscontrol.isLoggedIn, function(req, res, next) {
    udmcontroller.getLunghezzaUdms(req, res, function(err, data){
        if (err) return next(err);
        res.end(JSON.stringify(data));
    });
});

router.get('/capacita',accesscontrol.isLoggedIn, function(req, res, next) {
    udmcontroller.getCapacitaUdms(req, res, function(err, data){
        if (err) return next(err);
        res.end(JSON.stringify(data));
    });
});

router.get('/diametro',accesscontrol.isLoggedIn, function(req, res, next) {
    udmcontroller.getDiametroUdms(req, res, function(err, data){
        if (err) return next(err);
        res.end(JSON.stringify(data));
    });
});


module.exports = router;


