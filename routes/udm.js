var express = require('express')
var router = express.Router();
var udmcontroller = require('../controller/udmcontroller');
var accesscontrol = require('../security/accesscontrol');
var gestionaleLogger = require("../utility/gestionaleLogger");


router.get('/',accesscontrol.isLoggedIn, function(req, res, next) {
  udmcontroller.getUdms(req, res, function(err, data){
  gestionaleLogger.logger.debug(data);
          if (err) return next(err);
			res.end(JSON.stringify(data));
        });
});

router.get('/:idUdm',accesscontrol.isLoggedIn, function(req, res, next) {
    udmcontroller.getUdmById(req, res, function(err, data){
    gestionaleLogger.logger.debug(data);
        if (err) return next(err);
        res.end(JSON.stringify(data));
    });
});

module.exports = router;


