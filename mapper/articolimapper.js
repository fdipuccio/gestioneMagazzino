var articolimapper = require('./articolimapper')
const leftPad = require('left-pad')


articolimapper.CATEGORIES_OUT = function(data){
    var categoriaModel = {};
    var retVal = new Array();
    if(data){
        categoriaModel = {};
        categoriaModel.id = data[0].ID_CATEGORIA;
        categoriaModel.nome = data[0].NOME_CATEGORIA;
        categoriaModel.descrizione = data[0].DESCRIZIONE; 
        retVal.push(categoriaModel);
    }
    return retVal;
}


articolimapper.OUT = function(data){
    var articoloModel = {};
    if(data){
        articoloModel.idArticolo = data.ID_ARTICOLO;
        articoloModel.idCategoria = data.ID_CATEGORIA;
        articoloModel.descCategoria = data.DESC_CATEGORIA;
        articoloModel.codiceArticolo = data.CODICE_ARTICOLO;
        articoloModel.codiceBarre = data.CODICE_BARRE;
        articoloModel.descrizione = data.DESCRIZIONE;
        articoloModel.lunghezza = data.LUNGHEZZA;
        articoloModel.idUdmLunghezza = data.ID_UDM_LUNGHEZZA;
        articoloModel.udmLunghezza = data.UDM_LUNGHEZZA;
        articoloModel.qtyInScatola = data.QTY_SCATOLA;
        articoloModel.idUdmQtyInScatola = data.id_UDM_QTY_SCATOLA;
        articoloModel.udmQtyInScatola = data.UDM_QTY_SCATOLA;
        articoloModel.timerScadenza = data.TIMER_SCADENZA_DD;
        articoloModel.minimoMagazzino = data.MINIMO_MAGAZZINO;
        articoloModel.diametro = data.DIAMETRO;
        articoloModel.idUdmDiametro = data.ID_UDM_DIAMETRO;
        articoloModel.udmDiametro = data.UDM_DIAMETRO;
        articoloModel.marca = data.MARCA;
        articoloModel.idColore = data.ID_COLORE;
        articoloModel.colore = data.COLORE;
        articoloModel.prezzo = data.PREZZO;
        articoloModel.valuta = data.VALUTA;
        articoloModel.iva = data.IVA;
        articoloModel.valoreIva = data.VALORE_IVA;
        articoloModel.peso = data.PESO;
        articoloModel.idUdmPeso = data.ID_UDM_PESO;
        articoloModel.udmPeso = data.UDM_PESO;
        articoloModel.volume = data.VOLUME;
        articoloModel.idUdmVolume = data.ID_UDM_VOLUME;
        articoloModel.udmVolume = data.UDM_VOLUME;
        articoloModel.capacita = data.CAPACITA;
        articoloModel.idUdmCapacita = data.ID_UDM_CAPACITA;
        articoloModel.udmCapacita = data.UDM_CAPACITA;
        articoloModel.udm = data.UDM;
        articoloModel.note = data.NOTE;
        articoloModel.dataInserimento = data.DATA_INS;
        articoloModel.dataModifica = data.DATA_MOD;
        articoloModel.qty = data.QTY;
        articoloModel.idMagazzino = data.ID_MAGAZZINO;
    }

    return articoloModel;
}

articolimapper.OUT_ANDAMENTO_PREZZI = function(data){
    var retVal = new Array();
    var elem = {};
    if(data){
        for(var i in data){
            elem = {};
            elem.data=data[i].DATA_OPERAZIONE;
            elem.prezzo=data[i].PREZZO_ACQUISTO;
            retVal.push(elem);
        }
    }
    
    return retVal;
}

articolimapper.OUT_STORICO_ARTICOLO = function(data){
    var retVal = new Array();
    var elem = {};
    if(data){
        for(var i in data){
            elem = {};
            elem.idArticolo=data[i].ID_ARTICOLO;
            elem.codiceArticolo=data[i].CODICE_ARTICOLO;
            elem.fornitore=data[i].NOME_FORNITORE;
            elem.prezzoAcquisto=data[i].PREZZO_ACQUISTO;
            elem.tipoOperazione=data[i].TIPO_OPERAZIONE;
            elem.qty=data[i].QTY;
            elem.dataMovimento=data[i].DATA_CREAZIONE;
            retVal.push(elem);
        }
    }
    
    return retVal;
}

articolimapper.OUT_GRAFICO_AC_ARTICOLO = function(data){
    var retVal = new Array();
    var elem = {};
    var size = 0;
    var now = new Date();
    var meseanno = "";

    if(data){
        size=data[0].PROP_VALUE;
        for(var i in data){
            elem = {};
            elem.meseanno=data[i].MESEANNO;
            elem.carico=data[i].QTY_CARICO;
            elem.scarico=data[i].QTY_SCARICO;
            retVal.push(elem);
        }

        if(retVal.length < size){
            for (var m = 0; m < size; m++) {
                meseanno=  now.getFullYear() + "" +leftPad(now.getMonth()+1, 2, '0');
                if(!retVal[m] || retVal[m].meseanno!=meseanno){
                    elem = {};
                    elem.meseanno=meseanno;
                    elem.carico=0;
                    elem.scarico=0;
                    retVal.push(elem);
                }
                now.setMonth(now.getMonth() - 1);                
            }
        }

    }
    
    return retVal;
}

articolimapper.OUT_DISP_ARTICOLI = function(data){
    var retVal = new Array();
    var elem = {};
    if(data){
        for(var i in data){
            elem = {};
            elem.articolo=data[i].CODICE_ARTICOLO;
            elem.descrizione=data[i].DESCRIZIONE_ARTICOLO;
            elem.lotto=data[i].NLOTTO;
            elem.qty=data[i].QTY;
            elem.scadenza=data[i].SCADENZA;
            elem.magazzino=data[i].NOME_MAGAZZINO;
            elem.idMagazzino=data[i].ID_MAGAZZINO;
            elem.reparto=data[i].REPARTO;
            elem.scaffale=data[i].SCAFFALE;
            elem.posto=data[i].POSTO;

            retVal.push(elem);
        }
    }
    
    return retVal;
}

articolimapper.OUT_LISTA = function(data){
    var retVal = new Array();
    if(data){
        for(var i in data){
            retVal.push(articolimapper.OUT(data[i])); 
        }
    }
    
    return retVal;
}


module.exports = articolimapper