var coloridao = require('./coloridao')
var colorifactory = require('../factory/colorifactory')
var gestionaleLogger = require("../utility/gestionaleLogger");


coloridao.getAll = function(connection, cb){
	gestionaleLogger.logger.debug('coloridao  getAll');
	colorifactory.getAll(connection,function(err, data){
    if (err) return cb(err);
		return cb(null,data)
  });
}

coloridao.getById = function(idColore, connection, cb){
	gestionaleLogger.logger.debug('coloridao  getById');
	colorifactory.getById(idColore,connection,function(err, data){
    if (err) return cb(err);
		return cb(null,data)
  });
}

coloridao.canBeDeleted = function(idColore, connection, cb){
	gestionaleLogger.logger.debug('coloridao  canBeDeleted');
	colorifactory.canBeDeleted(idColore,connection,function(err, data){
    if (err) return cb(err);
		return cb(null,data)
  });
}

coloridao.deleteById = function(idColore,connection,cb){
	gestionaleLogger.logger.debug('coloridao  deleteById');
	colorifactory.deleteById(idColore,connection,function(err, data){
    if (err) return cb(err);
		return cb(null,data)
  });
}

coloridao.postColore = function(colore,connection,cb){
	gestionaleLogger.logger.debug('coloridao  postcolore');
	colorifactory.postColore(colore, connection,function(err, data){
    if (err) return cb(err);
		return cb(null,data)
  });
}

coloridao.putColore = function(idColore,colore,connection,cb){
	gestionaleLogger.logger.debug('coloridao  putcolore');
	colorifactory.putColore(idColore, colore, connection,function(err, data){
    if (err) return cb(err);
		return cb(null,data)
  });
}

	

module.exports = coloridao;