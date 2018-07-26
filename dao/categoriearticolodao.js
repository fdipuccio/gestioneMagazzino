var categoriearticolodao = require('./categoriearticolodao')
var categoriearticolofactory = require('../factory/categoriearticolofactory')
var gestionaleLogger = require("../utility/gestionaleLogger");


categoriearticolodao.getAll = function(connection, cb){
	gestionaleLogger.logger.debug('categoriearticolodao  getAll');
	categoriearticolofactory.getAll(connection,function(err, data){
    if (err) return cb(err);
		return cb(null,data)
  });
}

categoriearticolodao.getById = function(idCategoria, connection, cb){
	gestionaleLogger.logger.debug('categoriearticolodao  getById');
	categoriearticolofactory.getById(idCategoria,connection,function(err, data){
    if (err) return cb(err);
		return cb(null,data)
  });
}


categoriearticolodao.canBeDeleted = function(idCategoria, connection, cb){
	gestionaleLogger.logger.debug('categoriearticolodao  canBeDeleted');
	categoriearticolofactory.canBeDeleted(idCategoria,connection,function(err, data){
    if (err) return cb(err);
		return cb(null,data)
  });
}

categoriearticolodao.deleteById = function(idCategoria,connection,cb){
	gestionaleLogger.logger.debug('categoriearticolodao  deleteById');
	categoriearticolofactory.deleteById(idCategoria,connection,function(err, data){
    if (err) return cb(err);
		return cb(null,data)
  });
}

categoriearticolodao.postCategoria = function(categoria,connection,cb){
	gestionaleLogger.logger.debug('categoriearticolodao  postCategoria');
	categoriearticolofactory.postCategoria(categoria, connection,function(err, data){
    if (err) return cb(err);
		return cb(null,data)
  });
}

categoriearticolodao.putCategoria = function(idCategoria,categoria,connection,cb){
	gestionaleLogger.logger.debug('categoriearticolodao  putCategoria');
	categoriearticolofactory.putCategoria(idCategoria, categoria, connection,function(err, data){
    if (err) return cb(err);
		return cb(null,data)
  });
}

	

module.exports = categoriearticolodao;