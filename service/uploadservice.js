var uploadservice = require('./uploadservice')
var gestionaleLogger = require("../utility/gestionaleLogger");
var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var appRoot = require('app-root-path');

uploadservice.upload = function(req, cb){
    gestionaleLogger.logger.debug('uploadservice-upload');
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        var old_path = files.file.path,
            file_size = files.file.size,
            file_ext = files.file.name.split('.').pop(),
            index = old_path.lastIndexOf(path.sep) + 1;              
        fs.readFile(old_path, function(err, data) {
           // gestionaleLogger.logger.debug(' contenuto file: ' + data.toString('utf8'));
           fs.unlink(old_path, function(err) {
                if (err) {
                    cb(err, null);
                } else {
                    var retVal = {};
                    retVal.payload = data;
                    retVal.extension = "." + file_ext;
                    retVal.oldPath = old_path;
                    cb(null, retVal);
                }
            }); 
        });
    });
}

uploadservice.uploadAndSave = function(req, saveDir, fileName, cb){
    gestionaleLogger.logger.debug('uploadservice-uploadAndSave');
    uploadservice.upload(req, function(err, data){
        // gestionaleLogger.logger.debug(' contenuto file: ' + data.toString('utf8'));
        fs.writeFile(appRoot + path.sep + saveDir + path.sep + fileName + data.extension , data.payload, function(err) {
            if (err) {
                cb(err, null);
            } else {
                cb(null, "OK");
            }            
        });
    });
}

module.exports = uploadservice;