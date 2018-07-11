var colorimapper = require('./colorimapper')


colorimapper.COLORE_OUT_LISTA = function(data){
    var retVal = new Array();
    if(data && data.length > 0){
        for(var t in data){
            retVal.push(colorimapper.COLORE_OUT(data[t]));
        }
    }

    return retVal;
}


colorimapper.COLORE_OUT = function(data){
    var coloreModel = {};

    if(data){
        coloreModel.idColore=data.ID_COLORE;
        coloreModel.codice=data.CODICE;
        coloreModel.descrizione=data.DESCRIZIONE;
    }

    return coloreModel;
}

module.exports = colorimapper