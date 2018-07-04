var express = require('express')
var router = express.Router();
var comunicontroller = require('../controller/comunicontroller');
var accesscontrol = require('../security/accesscontrol');
var gestionaleLogger = require("../utility/gestionaleLogger");


router.get('/:codIstat',accesscontrol.isLoggedIn, function(req, res, next) {
  comunicontroller.getComuneByCodIstat(req, res, function(err, data){
  gestionaleLogger.logger.debug(data);
          if (err) return next(err);
			res.end(JSON.stringify(data));
        });
});

router.get('/cap/:comune',accesscontrol.isLoggedIn, function(req, res, next) {
    comunicontroller.getCapByComune(req, res, function(err, data){
    gestionaleLogger.logger.debug(data);
            if (err) return next(err);
              res.end(JSON.stringify(data));
          });
  });

router.get('/',accesscontrol.isLoggedIn, function(req, res,next) {
    comunicontroller.getComuni(req, res, function(err,data){
        gestionaleLogger.logger.debug('getComuni',data);
        if (err) return next(err);
        res.end(JSON.stringify(data));
    });
});

router.get('/pagedSearch/:filter/:top',accesscontrol.isLoggedIn, function(req, res,next) {
    comunicontroller.getComuniPagedSearch(req, res, function(err,data){
        gestionaleLogger.logger.debug('getComuniPagedSearch',data);
        if (err) return next(err);
        res.end(JSON.stringify(data));
    });
});

module.exports = router;


