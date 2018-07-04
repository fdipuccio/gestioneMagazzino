var express = require('express')
var router = express.Router();
var clienticontroller = require('../controller/clienticontroller');
var accesscontrol = require('../security/accesscontrol');
var gestionaleLogger = require("../utility/gestionaleLogger");



router.get('/',accesscontrol.isLoggedIn, function(req, res) {
    clienticontroller.readCustomers(req, res, function(err,data){
        //gestionaleLogger.logger.debug('readCustomer',data);
        if (err)  res.end(JSON.stringify(err));
        res.end(JSON.stringify(data));
    });
});


router.post('/advancedsearch',accesscontrol.isLoggedIn, function(req, res) {
    clienticontroller.advancedSearch(req, res, function(err,data){
        if (err)  res.end(JSON.stringify(err));
        res.end(JSON.stringify(data));
    });
});


router.get('/:idcliente',accesscontrol.isLoggedIn, function(req, res, next) {    
    clienticontroller.getCustomerById(req, res, function(err, data){
    ////gestionaleLogger.logger.debug(data);
            if (err)  res.end(JSON.stringify(err));
            res.end(JSON.stringify(data));
        });
});


router.post('/addclienti',accesscontrol.isLoggedIn, function(req, res) {
    gestionaleLogger.logger.debug('log',accesscontrol.isLoggedIn);
    clienticontroller.addCustomer(req, res, function(err,data){
        if (err) res.end(JSON.stringify(err));
            res.end(JSON.stringify(data));
    });  
});

router.put('/updateclienti/:idcliente',accesscontrol.isLoggedIn,  function(req, res) {
    clienticontroller.updateCustomer(req, res, function(err,data){
        if (err) return next(err);
         res.end(JSON.stringify(data));
    });
});

router.delete('/:idcliente',accesscontrol.isLoggedIn, function (req, res) {
    clienticontroller.deleteCustomer(req, res, function(data){        
         res.end(JSON.stringify(data));
    });
});


module.exports = router;


