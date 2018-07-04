var express = require('express')
var router = express.Router();
var ivaApplicatacontroller = require('../controller/ivaApplicatacontroller');
var accesscontrol = require('../security/accesscontrol');
var gestionaleLogger = require("../utility/gestionaleLogger");


router.get('/:idIva',accesscontrol.isLoggedIn, function(req, res, next) {
    ivaApplicatacontroller.getIvaApplicataById(req, res, function(err, data){
    gestionaleLogger.logger.debug(data);
    if (err) return next(err);
        res.end(JSON.stringify(data));
    });
});

router.get('/',accesscontrol.isLoggedIn, function(req, res,next) {
    ivaApplicatacontroller.getIvaApplicata(req, res, function(err,data){
    gestionaleLogger.logger.debug('getIvaApplicata',data);
    if (err) return next(err);
        res.end(JSON.stringify(data));
    });
});

module.exports = router;


