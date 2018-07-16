var express = require('express')
var router = express.Router();
var fornitoricontroller = require('../controller/fornitoricontroller');
var accesscontrol = require('../security/accesscontrol');
var gestionaleLogger = require("../utility/gestionaleLogger");



router.get('/:idFornitore',accesscontrol.isLoggedIn, function(req, res, next) {
  fornitoricontroller.getSupplierById(req, res, function(err, data){
    if (err)  res.end(JSON.stringify(err));
        res.end(JSON.stringify(data));
    });
});

router.get('/',accesscontrol.isLoggedIn, function(req, res, next) {
    fornitoricontroller.getSuppliers(req, res, function(err, data){
      if (err)  res.end(JSON.stringify(err));
          res.end(JSON.stringify(data));
      });
  });

router.post('/',accesscontrol.isLoggedIn, function(req, res) {
    gestionaleLogger.logger.debug('log',accesscontrol.isLoggedIn);
    fornitoricontroller.addSupplier(req, res, function(err,data){
        if (err) res.end(JSON.stringify(err));
            res.end(JSON.stringify(data));
    });
  
});

router.post('/advancedsearch',accesscontrol.isLoggedIn, function(req, res) {
    fornitoricontroller.advancedSearch(req, res, function(err,data){
        if (err)  res.end(JSON.stringify(err));
        res.end(JSON.stringify(data));
    });
});


router.put('/:idFornitore',accesscontrol.isLoggedIn,  function(req, res) {
    fornitoricontroller.updateSupplier(req, res, function(err,data){
        if (err)  res.end(JSON.stringify(err));
        res.end(JSON.stringify(data));
    });
});



router.delete('/:idFornitore',accesscontrol.isLoggedIn, function (req, res) {
  fornitoricontroller.deleteSupplier(req, res, function(err,data){
        if (err)  res.end(JSON.stringify(err));
        res.end(JSON.stringify(data));
    });
});


module.exports = router;


