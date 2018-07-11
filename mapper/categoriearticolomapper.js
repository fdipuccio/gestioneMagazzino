var categoriearticolomapper = require('./categoriearticolomapper')


categoriearticolomapper.CATEGORIA_OUT_LISTA = function(data){
    var retVal = new Array();
    if(data && data.length > 0){
        for(var t in data){
            retVal.push(categoriearticolomapper.CATEGORIA_OUT(data[t]));
        }
    }

    return retVal;
}


categoriearticolomapper.CATEGORIA_OUT = function(data){
    var categoriaModel = {};

    if(data){
        categoriaModel.idCategoria=data.ID_CATEGORIA;
        categoriaModel.nome=data.NOME_CATEGORIA;
        categoriaModel.descrizione=data.DESCRIZIONE;
    }

    return categoriaModel;
}

module.exports = categoriearticolomapper