var homemapper = require('./colorimapper')


colorimapper.OUT_ALERT_QUANTITA = function(data){
    var retVal = new Array();
    var alertModel = {};

    if(data && data.length > 0){
        for(var t in data){
            alertModel = {};
            alertModel.idArticolo=data.ID_ARTICOLO;
            alertModel.codiceArticolo=data.CODICE_ARTICOLO;
            alertModel.descrizioneArticolo=data.DESCRIZIONE;
            alertModel.qty=data.QTY;
            retVal.push(alertModel);
        }
    }

    return retVal;
}


colorimapper.OUT_ALERT_SCADENZA = function(data){
    var retVal = new Array();
    var alertModel = {};

    if(data && data.length > 0){
        for(var t in data){
            alertModel = {};
            alertModel.idArticolo=data.ID_ARTICOLO;
            alertModel.codiceArticolo=data.CODICE_ARTICOLO;
            alertModel.descrizioneArticolo=data.DESCRIZIONE;
            alertModel.dataScadenza=data.DATA_SCADENZA;
            retVal.push(alertModel);
        }
    }

    return retVal;
}

module.exports = colorimapper