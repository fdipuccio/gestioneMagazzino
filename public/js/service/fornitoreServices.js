angular.module("gestionaleApp").factory('FornitoreService', function($http) {
        return {
            getFornitoriList : function(){            	
            	var tempUrl = '/fornitori';                	
            	
            	 return $http({
               	  method: 'GET',
               	  url: tempUrl        	  
               });
            	
            },
            getAdvSearchFornitoriList : function(filter){              
              var tempUrl = '/fornitori/advancedsearch';
              
               return $http({
                  method: 'POST',
                  url: tempUrl,
                  data : filter          
               });
              
            },
            getIndicatoriPerIdFornitore : function(p_id){              
              var tempUrl = '/fornitori/indicatoripagamento/'+p_id;
              
               return $http({
                  method: 'GET',
                  url: tempUrl         
               });
              
            },
            removeFornitore : function(p_id){            	
            	var tempUrl = '/fornitori/'+p_id;
            	
            	 return $http({
               	  method: 'DELETE',
               	  url: tempUrl        	  
               });
            	
            },                        
            createFornitore : function(newFornitore){
                var p_body = {};                
                
            	var tempUrl = '/fornitori/addfornitori';                	
            	
            	 return $http({
               	     method: 'POST',
                     url: tempUrl,
                     data:  newFornitore      	  
               });
            	
            },
            getFornitoreById : function(p_id){                        
                
            	var tempUrl = '/fornitori/'+p_id;                	
            	
            	 return $http({
               	     method: 'GET',
                     url: tempUrl    	  
               });
            	
            },
            getFornitoreByIdDettFatt : function(p_id){                        
                
               var tempUrl = '/fornitori/'+p_id+'?deleted=true';                 
               
                return $http({
                       method: 'GET',
                     url: tempUrl        
               });
               
            },
            updateFornitore : function(p_id, editFornitore){                        
                
            	var tempUrl = '/fornitori/updatefornitori/'+p_id;                	
            	
            	 return $http({
               	     method: 'PUT',
                     url: tempUrl ,
                     data:  editFornitore     	  
               });
            	
            },
             getContiByIdFornitore : function(p_id){                        
                
            	var tempUrl = '/fornitori/'+p_id+'/account';      	
            	
            	 return $http({
               	     method: 'GET',
                     url: tempUrl    	  
               });
            	
            },
            salvaContoFornitore : function(pIdFornitore, pNuovoConto){                        
                
            	var tempUrl = '/fornitori/'+pIdFornitore+'/account';      	
            	
            	 return $http({
               	     method: 'POST',
                     url: tempUrl ,
                     data:  pNuovoConto   	  
               });
            	
            },
            deleteContoFornitore : function(p_id){            	
            	var tempUrl = '/fornitori/account/'+p_id;                	
            	
            	 return $http({
               	  method: 'DELETE',
               	  url: tempUrl        	  
               });
            	
            },
            getAppuntamentiForn : function(pIdFornitore, pNuovoAppuntamento){                        
                
               var tempUrl = '/fornitori/'+pIdFornitore+'/appuntamenti';         
               
                return $http({
                       method: 'GET',
                     url: tempUrl        
               });
            },
            createAppuntamentoForn : function(pIdFornitore, pNuovoAppuntamento){                        
                
               var tempUrl = '/fornitori/'+pIdFornitore+'/appuntamenti';         
               
                return $http({
                       method: 'POST',
                     url: tempUrl ,
                     data:  pNuovoAppuntamento        
               });
            },
            deleteAppuntamentoForn : function(pIdFornitore, pIdAppuntamento){                        
                
               var tempUrl = '/fornitori/'+pIdFornitore+'/appuntamenti/'+pIdAppuntamento;         
               
                return $http({
                       method: 'DELETE',
                     url: tempUrl
               });
            },
             getFornitoriWithContracts : function(){                        
                
              var tempUrl = '/contrattiManutenzione/fornitori';        
              
               return $http({
                     method: 'POST',
                     url: tempUrl       
               });
              
            },
             getElencoContratti : function(p_id){                        
                
              var tempUrl = '/fornitori/'+p_id+'/contracts';        
              
               return $http({
                     method: 'GET',
                     url: tempUrl       
               });
              
            },
             getElencoContrattiByCli : function(p_id){                        
                
              var tempUrl = '/contrattiManutenzione/'+p_id;        
              
               return $http({
                     method: 'GET',
                     url: tempUrl       
               });
              
            },
            salvaContrattoFornitore : function(pIdFornitore, pNuovoContratto){                        
                
              var tempUrl = '/fornitori/'+pIdFornitore+'/contracts';        
              
               return $http({
                     method: 'POST',
                     url: tempUrl ,
                     data:  pNuovoContratto       
               });
              
            },
            getContrattoFornitoreById : function(pIdFornitore, pIdContratto){              
              var tempUrl = '/fornitori/'+pIdFornitore+'/contracts/'+pIdContratto;
              
               return $http({
                  method: 'GET',
                  url: tempUrl         
               });
              
            },
            aggiornaContrattoFornitore : function(pIdFornitore, pModificaContratto, pIdContratto){                        
                
              var tempUrl = '/fornitori/'+pIdFornitore+'/contracts/'+pIdContratto;        
              
               return $http({
                     method: 'PUT',
                     url: tempUrl ,
                     data:  pModificaContratto       
               });
              
            },
            creaFatturaDaContratto : function(pIdFornitore, pFatturaContratto, pIdContratto){
                
              var tempUrl = '/contrattiManutenzione/'+pIdFornitore+'/contracts/'+pIdContratto+'/fattura';        
              
               return $http({
                     method: 'POST',
                     url: tempUrl ,
                     data:  pFatturaContratto       
               });
              
            },

            getArticoliAssociati : function(pIdFornitore){
                
              var tempUrl = '/fornitori/'+pIdFornitore+'/articoli';        
              
               return $http({
                     method: 'GET',
                     url: tempUrl                           
               });
              
            },
            deleteAssociazioneArticoloForn : function(pIdFornitore, pCodiceForn){                        
                
               var tempUrl = '/fornitori/'+pIdFornitore+'/articoli/'+pCodiceForn;        
               
                return $http({
                       method: 'DELETE',
                       url: tempUrl
                });
            }
            
        }
    });