angular.module("gestionaleApp").factory('AziendaService', function($http) {
        return {
            getDatiAzienda : function(){
              
              var tempUrl = '/azienda/1';                  
              
               return $http({
                  method: 'GET',
                  url: tempUrl        
               });
              
            },
            aggiornaDatiAzienda : function(updateAzienda, p_id){
              var p_body = {};

              p_body.id=p_id;
              p_body.ragioneSociale=updateAzienda.RAGIONE_SOCIALE; 
              p_body.indirizzo=updateAzienda.INDIRIZZO; 
              p_body.email=updateAzienda.EMAIL; 
              p_body.telefono=updateAzienda.TELEFONO; 
              p_body.fax=updateAzienda.FAX; 
              p_body.cellulare=updateAzienda.CELLULARE; 
              p_body.logo=updateAzienda.logo; 

              var tempUrl = '/azienda/'+p_id;      
              
               return $http({
                     method: 'PUT',
                     url: tempUrl,
                     data: p_body          
               });
              
            },
            esisteAzienda : function(){
                
                var tempUrl = '/azienda/esisteAzienda';                  
            
                return $http({
                method: 'GET',
                url: tempUrl        
                });
            
            },
            getContiByAzienda : function(idAzienda){
                       	
            	var tempUrl = '/azienda/'+idAzienda+'/conti';                	
            	
            	 return $http({
               	  method: 'GET',
               	  url: tempUrl        	  
               });            	
            },
            getContiAziendaById : function(idConto){
                       	
            	var tempUrl = '/azienda/conti/'+idConto;                	
            	
            	 return $http({
               	  method: 'GET',
               	  url: tempUrl        	  
               });            	
            },
            salvaContoAzienda : function(pIdAzienda, pNuovoConto){                        
                var p_body = {};
                p_body.conto= {};
                p_body.conto = pNuovoConto;
                p_body.conto.idAzienda = pIdAzienda;
            	var tempUrl = '/azienda/'+pIdAzienda+'/conti';      	
            	
            	 return $http({
               	     method: 'POST',
                     url: tempUrl ,
                     data: p_body   	  
               });
            	
            },
            AggiornaContoAzienda : function(pIdAzienda, pIdConto, pEditConto){                        
                var p_body = {};
                p_body.conto= {};
                p_body.conto = pEditConto;
                p_body.conto.idAzienda = pIdAzienda;
            	var tempUrl = '/azienda/conti/'+pIdConto;      	
            	
            	 return $http({
               	     method: 'PUT',
                     url: tempUrl ,
                     data: p_body   	  
               });
            	
            },
            deleteContoAzienda : function(p_id){            	
            	var tempUrl = '/azienda/conti/'+p_id;                	
            	
            	 return $http({
               	  method: 'DELETE',
               	  url: tempUrl        	  
               });
            	
            }

        }


    });