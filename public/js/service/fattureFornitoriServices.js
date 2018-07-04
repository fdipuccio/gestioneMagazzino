angular.module("gestionaleApp").factory('FattureFornitoriService', function($http) {
        return {            
            getFattureWithFilterList : function(filter){              
              var tempUrl = '/fatture/fornitore/advancedsearch';                 
              
               return $http({
                  method: 'POST',
                  url: tempUrl,
                  data : filter          
               });              
            },
            setPreferita: function(pIdFattura, flagPreferita) {

              var tempUrl = '/fatture/preferita/'+pIdFattura+'?value='+flagPreferita                 
              
               return $http({
                     method: 'PATCH',
                     url: tempUrl      
               });

            },
            getRangeDateEmissione : function(pBody){
                //TODO cambiare cliente in fornitore
               var tempUrl = '/fatture/rangedataemissione/fornitore';                   
               
                return $http({
                    method: 'POST',
                  url: tempUrl,
                  data: pBody    
               });
               
            },
            creaFattura : function(nuovaFattura, tipoFattura){
                var pBody = {};
                pBody.fattura = {};
                pBody.fattura.core = 	nuovaFattura.core;
                pBody.fattura.header = nuovaFattura.header;
                pBody.fattura.righe = nuovaFattura.righe;
                pBody.fattura.scadenza = nuovaFattura.scadenza;
            
                if(nuovaFattura.allegati!=undefined && nuovaFattura.allegati!=null){
                    pBody.fattura.allegati = nuovaFattura.allegati;
                }

                var tempUrl = '/fatture/acquisto';                	
            	
            	 return $http({
               	  method: 'POST',
                  url: tempUrl,
                  data:  pBody     	  
               });
            	
            },
            
            checkNumeroFattura : function(idFornitore,fattura){
                var pBody = {};
                pBody.fattura = fattura;
                var tempUrl = '/fornitori/'+idFornitore+'/checknumerofattura';                	
            	
            	 return $http({
               	  method: 'POST',
                  url: tempUrl,
                  data:  pBody     	  
               });
            	
            },
            getPagamentoFattura: function(modalitaPagamento, totale) {

                var tempUrl = '/pagamentofatture/'+modalitaPagamento+'/totale/'+totale;                	
            	
            	 return $http({
               	  method: 'GET',
               	  url: tempUrl        	  
               });

            },
            //TODO capire se i servizi vanno duplicati con altro endpoint
            getFatturaCoreById: function(pIdFattura) {

                var tempUrl = '/fatture/'+pIdFattura;             	
            	
            	 return $http({
               	  method: 'GET',
               	  url: tempUrl        	  
               });

            },
            //TODO capire se i servizi vanno duplicati con altro endpoint
            getFatturaRigheById: function(pIdFattura) {

                var tempUrl = '/fatture/righe/'+pIdFattura;             	
            	
            	 return $http({
               	  method: 'GET',
               	  url: tempUrl        	  
               });

            },
            //TODO capire se i servizi vanno duplicati con altro endpoint
            getFatturaTestataById: function(pIdFattura) {

                var tempUrl = '/fatture/testata/'+pIdFattura;             	
            	
            	 return $http({
               	  method: 'GET',
               	  url: tempUrl        	  
               });

            },
            //TODO capire se i servizi vanno duplicati con altro endpoint
            getFatturaScadenzeById: function(pIdFattura) {

                var tempUrl = '/fatture/scadenze/'+pIdFattura;             	
            	
            	 return $http({
               	  method: 'GET',
               	  url: tempUrl        	  
               });

            },
            updateFattura : function(pFattura, tipoFattura){
                var pBody = {};
                pBody.fattura = {};
                pBody.fattura.core =    pFattura.core;
                pBody.fattura.header = pFattura.header;
                pBody.fattura.righe = pFattura.righe;
                pBody.fattura.scadenza = pFattura.scadenza;
                
                if(pFattura.allegati!=undefined && pFattura.allegati!=null){
                    pBody.fattura.allegati = pFattura.allegati;
                }

                var tempUrl = '/fatture/acquisto/'+pFattura.header.id;                   
               
                return $http({
                    method: 'PUT',
                  url: tempUrl,
                  data:  pBody        
               });
               
            },
            registraPagamento : function(p_pagamento, p_idFattura){
            var pBody = {};
            pBody.pagamento = p_pagamento;
            pBody.idFattura = p_idFattura;
            
            var tempUrl = '/fatture/acquisto/registraPagamento';                	
            	
            	 return $http({
               	  method: 'POST',
                  url: tempUrl,
                  data:  pBody     	  
               });
            	
            },
            annullaPagamento : function(p_pagamento, p_idFattura){
            var pBody = {};
            pBody.pagamento = p_pagamento;
            pBody.idFattura = p_idFattura;
            
            var tempUrl = '/fatture/acquisto/annullaPagamento';                	
            	
            	 return $http({
               	  method: 'POST',
                  url: tempUrl,
                  data:  pBody     	  
               });
            	
            },
            registraPagamentoMassivo : function(pPagamenti,pData,pIdConto){            
            var body = {};
            body.pagamento = pPagamenti;
            body.idConto = pIdConto;
            body.datamovimento = pData;

            var tempUrl = '/fatture/acquisto/registrapagamentomassivo';                	
            	
            	 return $http({
               	  method: 'POST',
                  url: tempUrl,
                  data:  body     	  
               });
            	
            },  
            generaDdt: function(pId) {

                 var tempUrl = '/fatture/acquisto/'+pId+'/ddt' ;                	
            	
            	 return $http({
               	  method: 'POST',
               	  url: tempUrl        	  
               });

            },
            generaNdc: function(pFattura) {
                var pBody = {};
                pBody.fattura = {};
                pBody.fattura = pFattura;
                var tempUrl = '/fatture/acquisto/notacredito' ;                	
               
                return $http({
                    method: 'POST',
                    url: tempUrl,
                    data:  pBody 
              });

           } 
        }
    });