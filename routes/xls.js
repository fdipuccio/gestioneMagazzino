var express = require('express')
var router = express.Router();
var jsonXlsx = require('icg-json-to-xlsx');
var path = require('path');
var appRoot = require('app-root-path');
var fs = require('fs');
var data = {};
var gestionaleLogger = require("../utility/gestionaleLogger");

router.get('/create', function (req, res, next) {
    var xlsxPath = appRoot + '//temp//xlsx';
    jsonData = [
        {
            "Movimento": "Pagamento Fattura 2/2018",
            "Cassa": 5000,
            "Banca": 0 
        },{
            "Movimento": "Pagamento Fattura 3/2018",
            "Cassa": 25000,
            "Banca": 0 
        }, {
            "Movimento": "Pagamento riparazione Autocarro",
            "Cassa": 0,
            "Banca": 700 
        }
    ];

    filename = path.join(xlsxPath, "basic-sheet-with-headers-output.xlsx");
    headers = ["Movimento", "Cassa", "Banca"];
    try {
        var buffer = jsonXlsx.writeBuffer(jsonData,{
            headers: headers,
            sheetName: "Sheet Test"
        });
        outputFile = jsonXlsx.writeFile(filename, jsonData, {
            headers: headers,
            sheetName: "Sheet Test"
        });
        data = {"result": "OK", "data": buffer , "contentType": "application/xlsx"};
        res.end(JSON.stringify(data))
    } catch (err) {
        gestionaleLogger.logger.debug('errore : ', err);
        throw new Error(err.message);
    }


});


router.get('/show/:nameFile', function (req, res, next) {

    var nameFile = req.params.nameFile;
    var xlsxPath = appRoot + '//temp//xlsx//';
    var path = xlsxPath + nameFile;
        var readStream = fs.createReadStream(path);
        readStream.on('open', function () {
            readStream.pipe(res);
        });

});

module.exports = router;


