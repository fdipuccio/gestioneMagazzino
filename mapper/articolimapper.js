var articolimapper = require('./articolimapper')



articolimapper.OUT = function(data){
    var articoloModel = {};
    if(data[0]){
        articoloModel.idArticolo = data[0].ID_ARTICOLO;
        articoloModel.idCategoria = data[0].ID_CATEGORIA;
        articoloModel.descCategoria = data[0].DESC_CATEGORIA;
        articoloModel.codiceArticolo = data[0].CODICE_ARTICOLO;
        articoloModel.codiceBarre = data[0].CODICE_BARRE;
        articoloModel.descrizione = data[0].DESCRIZIONE;
        articoloModel.lunghezza = data[0].LUNGHEZZA;
        articoloModel.udmLunghezza = data[0].UDM_LUNGHEZZA;
        articoloModel.qtyInScatola = data[0].QTY_SCATOLA;
        articoloModel.udmQtyInScatola = data[0].UDM_QTY_SCATOLA;
        articoloModel.timerScadenza = data[0].TIMER_SCADENZA_HH;
        articoloModel.minimoMagazzino = data[0].MINIMO_MAGAZZINO;
        articoloModel.diametro = data[0].DIAMETRO;
        articoloModel.udmDiametro = data[0].UDM_DIAMETRO;
        articoloModel.marca = data[0].MARCA;
        articoloModel.colore = data[0].COLORE;
        articoloModel.prezzo = data[0].PREZZO;
        articoloModel.valuta = data[0].VALUTA;
        articoloModel.iva = data[0].IVA;
        articoloModel.valoreIva = data[0].VALORE_IVA;
        articoloModel.peso = data[0].PESO;
        articoloModel.udmPeso = data[0].UDM_PESO;
        articoloModel.volume = data[0].VOLUME;
        articoloModel.udmVolume = data[0].UDM_VOLUME;
        articoloModel.capacita = data[0].CAPACITA;
        articoloModel.udmCapacita = data[0].UDM_CAPACITA;
        articoloModel.udm = data[0].UDM;
        articoloModel.note = data[0].NOTE;
        articoloModel.dataInserimento = data[0].DATA_INS;
        articoloModel.dataModifica = data[0].DATA_MOD;
        articoloModel.qty = data[0].QTY;
        articoloModel.idMagazzino = data[0].ID_MAGAZZINO;
    }

    return articoloModel;
}


articolimapper.OUT_LISTA = function(data){
    return data;
}


module.exports = articolimapper