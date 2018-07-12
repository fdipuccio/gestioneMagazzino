var fornitorimapper = require('./fornitorimapper')


fornitorimapper.FORNITORE_OUT_LISTA = function(data){
    var retVal = new Array();
    if(data && data.length > 0){
        for(var t in data){
            retVal.push(fornitorimapper.FORNITORE_OUT(data[t]));
        }
    }

    return retVal;
}


fornitorimapper.FORNITORE_OUT = function(data){
    var fornitoreModel = {};

    if(data){
        fornitoreModel.idfornitore=data.ID_FORNITORE;
        fornitoreModel.nome=data.NOME;
        fornitoreModel.indirizzo=data.INDIRIZZO;
        fornitoreModel.idcomune=data.IDCOMUNE;
        fornitoreModel.noteExtraIndirizzo=data.NOTE_EXTRA_INDIRIZZO;
        fornitoreModel.partitaIva=data.PARTITA_IVA;
        fornitoreModel.codiceFiscale=data.CODICE_FISCALE;
        fornitoreModel.mail=data.MAIL;
        fornitoreModel.telefono=data.TELEFONO;
        fornitoreModel.fax=data.FAX;
        fornitoreModel.noteFornitore=data.NOTE_FORNITORE;
    }

    return fornitoreModel;
}

module.exports = fornitorimapper