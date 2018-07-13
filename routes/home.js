var express = require('express');
var homecontroller = require('../controller/homecontroller');
var accesscontrol = require('../security/accesscontrol');
var router = express.Router();

router.get('/alert/scadenza',accesscontrol.isLoggedIn, function(req, res,next) {
    homecontroller.getDatiAlertScadenza(req, res, function(err,data){
        if (err) return next(err);
        res.end(JSON.stringify(data));
    });
});

router.get('/alert/quantita',accesscontrol.isLoggedIn, function(req, res,next) {
    homecontroller.getDatiAlertQuantita(req, res, function(err,data){
    if (err) return next(err);
        res.end(JSON.stringify(data));
    });
});

module.exports = router;
