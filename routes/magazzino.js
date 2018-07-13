var express = require('express')
var router = express.Router();
var magazzinocontroller = require('../controller/magazzinocontroller');
var accesscontrol = require('../security/accesscontrol');
var gestionaleLogger = require("../utility/gestionaleLogger");



router.get('/',accesscontrol.isLoggedIn, function(req, res,next) {
    magazzinocontroller.getMagazzini(req, res, function(err,data){
        gestionaleLogger.logger.debug('getMagazzini',data);
        if (err) return next(err);
        res.end(JSON.stringify(data));
    });
});

router.get('/:idMagazzino',accesscontrol.isLoggedIn, function(req, res,next) {
    magazzinocontroller.getMagazzinoById(req, res, function(err,data){
        gestionaleLogger.logger.debug('getMagazzinoById',data);
        if (err) return next(err);
        res.end(JSON.stringify(data));
    });
});

router.post('/',accesscontrol.isLoggedIn, function(req, res,next) {
    magazzinocontroller.addMagazzino(req, res, function(err,data){
        gestionaleLogger.logger.debug('addMagazzino',data);
        if (err) return next(err);
        res.end(JSON.stringify(data));
    });
});

router.put('/:idMagazzino',accesscontrol.isLoggedIn, function(req, res,next) {
    magazzinocontroller.putMagazzino(req, res, function(err,data){
        gestionaleLogger.logger.debug('putMagazzino',data);
        if (err) return next(err);
        res.end(JSON.stringify(data));
    });
});

router.delete('/:idMagazzino',accesscontrol.isLoggedIn, function(req, res,next) {
    magazzinocontroller.deleteMagazzino(req, res, function(err,data){
        gestionaleLogger.logger.debug('deleteMagazzino',data);
        if (err) return next(err);
        res.end(JSON.stringify(data));
    });
});



module.exports = router;


