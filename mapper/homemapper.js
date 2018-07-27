var homemapper = require('./colorimapper')


homemapper.OUT_ALERT_QUANTITA = function(data){
    var retVal = new Array();
    var alertModel = {};

    if(data && data.length > 0){
        for(var t in data){
            alertModel = {};
            alertModel.idArticolo=data[t].ID_ARTICOLO;
            alertModel.codiceArticolo=data[t].CODICE_ARTICOLO;
            alertModel.descrizioneArticolo=data[t].DESCRIZIONE;
            alertModel.qty=data[t].QTY;
            retVal.push(alertModel);
        }
    }

    return retVal;
}


homemapper.OUT_ALERT_SCADENZA = function(data){
    var retVal = new Array();
    var alertModel = {};

    if(data && data.length > 0){
        for(var t in data){
            alertModel = {};
            alertModel.idArticolo=data[t].ID_ARTICOLO;
            alertModel.codiceArticolo=data[t].CODICE_ARTICOLO;
            alertModel.qty=data[t].QTY;
            alertModel.descrizioneArticolo=data[t].DESCRIZIONE;
            alertModel.dataScadenza=data[t].DATA_SCADENZA;
            retVal.push(alertModel);
        }
    }

    return retVal;
}

module.exports = homemapper