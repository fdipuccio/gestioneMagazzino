angular.module("gestionaleApp").factory('FattureService', function($http) {
        return {
            getFattureList : function(){
            	
                var tempUrl = '/fatture';                	
            	
            	 return $http({
               	  method: 'GET',
               	  url: tempUrl        	  
               });
            	
            },
            getFattureWithFilterList : function(filter){              
              var tempUrl = '/fatture/cliente/advancedsearch';                 
              
               return $http({
                  method: 'POST',
                  url: tempUrl,
                  data : filter          
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
            
                var tempUrl = '/fatture/'+tipoFattura;                	
            	
            	 return $http({
               	  method: 'POST',
                  url: tempUrl,
                  data:  pBody     	  
               });
            	
            },
            getRangeDateEmissione : function(pBody){
               var tempUrl = '/fatture/rangedataemissione/cliente';                   
               
                return $http({
                    method: 'POST',
                  url: tempUrl,
                  data: pBody    
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

                var tempUrl = '/fatture/'+tipoFattura+'/'+pFattura.header.id;                   
               
                return $http({
                    method: 'PUT',
                  url: tempUrl,
                  data:  pBody        
               });
               
            },
            removeDDT : function(p_id){            	
            	var tempUrl = 'fatture/ddt/'+p_id;
            	
            	 return $http({
               	  method: 'DELETE',
               	  url: tempUrl        	  
               });
            	
            },
            getPagamentoFattura: function(modalitaPagamento, totale) {

                var tempUrl = '/pagamentofatture/'+modalitaPagamento+'/totale/'+totale;                	
            	
            	 return $http({
               	  method: 'GET',
               	  url: tempUrl        	  
               });

            },
            creaPdfFattura: function(pId) {

                var tempUrl = '/pdf/creaFattura/'+pId;                	
            	
            	 return $http({
               	  method: 'GET',
               	  url: tempUrl        	  
               });

            },
            generaDdt: function(pId) {

                 var tempUrl = '/fatture/'+pId+'/ddt' ;                	
            	
            	 return $http({
               	  method: 'POST',
               	  url: tempUrl        	  
               });

            },
            generaNdc: function(pFattura) {
                var pBody = {};
                pBody.fattura = {};
                pBody.fattura = pFattura;
                var tempUrl = '/fatture/notacredito' ;                	
               
                return $http({
                    method: 'POST',
                    url: tempUrl,
                    data:  pBody 
              });

           },
           getNDCById: function(pIdNdc) {

               var tempUrl = '/fatture/notacredito/'+pIdNdc;             	
               
                return $http({
                    method: 'GET',
                    url: tempUrl        	  
              });

           },
           editNdc: function(pFattura, pIdNdc) {
               var pBody = {};
               pBody.fattura = {};
               pBody.fattura = pFattura;
               var tempUrl = '/fatture/notacredito/'+pIdNdc ;                	
              
               return $http({
                   method: 'PUT',
                   url: tempUrl,
                   data:  pBody 
             });

          },
            showPdfFattura: function(pNomeFile) {

                var tempUrl = '/pdf/show/'+pNomeFile;             	
            	
            	 return $http({
               	  method: 'GET',
               	  url: tempUrl        	  
               });

            },
            getFatturaCoreById: function(pIdFattura) {

                var tempUrl = '/fatture/'+pIdFattura;             	
            	
            	 return $http({
               	  method: 'GET',
               	  url: tempUrl        	  
               });

            },
            getFatturaRigheById: function(pIdFattura) {

                var tempUrl = '/fatture/righe/'+pIdFattura;             	
            	
            	 return $http({
               	  method: 'GET',
               	  url: tempUrl        	  
               });

            },
            getFatturaTestataById: function(pIdFattura) {

                var tempUrl = '/fatture/testata/'+pIdFattura;             	
            	
            	 return $http({
               	  method: 'GET',
               	  url: tempUrl        	  
               });

            },
            getFatturaScadenzeById: function(pIdFattura) {

                var tempUrl = '/fatture/scadenze/'+pIdFattura;             	
            	
            	 return $http({
               	  method: 'GET',
               	  url: tempUrl        	  
               });

            },
            getFattureByClienteId: function(pIdCliente) {

                var tempUrl = '/fatture/cliente/'+pIdCliente;              
              
               return $http({
                  method: 'GET',
                  url: tempUrl            
               });

            },
            registraPagamento : function(p_pagamento, p_idFattura){
            var pBody = {};
            pBody.pagamento = p_pagamento;
            pBody.idFattura = p_idFattura;
            
            var tempUrl = '/fatture/registraPagamento';                	
            	
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
            
            var tempUrl = '/fatture/annullaPagamento';                	
            	
            	 return $http({
               	  method: 'POST',
                  url: tempUrl,
                  data:  pBody     	  
               });
            	
            },
            registaPagamentoMassivo : function(pPagamenti,pData,pIdConto){            
            var body = {};
            body.pagamento = pPagamenti;
            body.idConto = pIdConto;
            body.datamovimento = pData;

            var tempUrl = '/fatture/registrapagamentomassivo';                	
            	
            	 return $http({
               	  method: 'POST',
                  url: tempUrl,
                  data:  body     	  
               });
            	
            },
            getTipoFattura: function() {

                var tempUrl = '/tipofatture';               
              
               return $http({
                  method: 'GET',
                  url: tempUrl            
               });

            },
            setPreferita: function(pIdFattura, flagPreferita) {

              var tempUrl = '/fatture/preferita/'+pIdFattura+'?value='+flagPreferita                 
              
               return $http({
                     method: 'PATCH',
                     url: tempUrl      
               });

            }            

        }
    });