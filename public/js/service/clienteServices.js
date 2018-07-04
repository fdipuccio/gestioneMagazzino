angular.module("gestionaleApp").factory('ClienteService', function($http) {
        return {
            getClientiList : function(){            	
            	var tempUrl = '/clienti';                	
            	
            	 return $http({
               	  method: 'GET',
               	  url: tempUrl        	  
               });
            	
            },
            getAdvSearchClientiList : function(filter){              
              var tempUrl = '/clienti/advancedsearch';
              
               return $http({
                  method: 'POST',
                  url: tempUrl,
                  data : filter          
               });
              
            },
            getIndicatoriPerIdCliente : function(p_id){              
              var tempUrl = '/clienti/indicatoripagamento/'+p_id;
              
               return $http({
                  method: 'GET',
                  url: tempUrl         
               });
              
            },
            removeCliente : function(p_id){            	
            	var tempUrl = '/clienti/'+p_id;
            	
            	 return $http({
               	  method: 'DELETE',
               	  url: tempUrl        	  
               });
            	
            },    
            creaPdfContratto: function(idContratto,idCliente) {

                  var tempUrl = '/pdf/manutenzione/'+idCliente+'/'+idContratto;                	
                    
                     return $http({
                         method: 'GET',
                         url: tempUrl        	  
                 });
              },                    
            createCliente : function(newCliente){
                var p_body = {};                
                
            	var tempUrl = '/clienti/addclienti';                	
            	
            	 return $http({
               	     method: 'POST',
                     url: tempUrl,
                     data:  newCliente      	  
               });
            	
            },
            getClienteById : function(p_id){                        
                
            	var tempUrl = '/clienti/'+p_id;                	
            	
            	 return $http({
               	     method: 'GET',
                     url: tempUrl    	  
               });
            	
            },
            getClienteByIdDettFatt : function(p_id){                        
                
               var tempUrl = '/clienti/'+p_id+'?deleted=true';                 
               
                return $http({
                       method: 'GET',
                     url: tempUrl        
               });
               
            },
            updateCliente : function(p_id, editCliente){                        
                
            	var tempUrl = '/clienti/updateclienti/'+p_id;                	
            	
            	 return $http({
               	     method: 'PUT',
                     url: tempUrl ,
                     data:  editCliente     	  
               });
            	
            },
            getContiByIdCliente : function(p_id){                        
               
                 var tempUrl = '/clienti/'+p_id+'/account';      	
                 
                  return $http({
                         method: 'GET',
                    url: tempUrl    	  
              });
                 
            },
            getIndirizziByIdCliente : function(p_id){                        
              
                var tempUrl = '/clienti/'+p_id+'/indirizzi';      	
                
                 return $http({
                        method: 'GET',
                   url: tempUrl    	  
             });
                
            },
            salvaContoCliente : function(pIdCliente, pNuovoConto){                        
                
            	var tempUrl = '/clienti/'+pIdCliente+'/account';      	
            	
            	 return $http({
               	     method: 'POST',
                     url: tempUrl ,
                     data:  pNuovoConto   	  
               });
            	
            },
            deleteContoCliente : function(p_id){            	
            	var tempUrl = '/clienti/account/'+p_id;                	
            	
            	 return $http({
               	  method: 'DELETE',
               	  url: tempUrl        	  
               });
            	
            },
            salvaIndirizzoCliente : function(pIdCliente, pNuovoIndirizzo){                        
                  p_body = {};
                  p_body.indirizzo = pNuovoIndirizzo;
            	var tempUrl = '/clienti/'+pIdCliente+'/indirizzi';      	
            	
            	 return $http({
               	     method: 'POST',
                     url: tempUrl ,
                     data:  p_body   	  
               });
            	
            },
            modificaIndirizzoCliente : function(pIdCliente, pModificaIndirizzo, pIdIndirizzo){                        
                  p_body = {};
                  p_body.indirizzo = pModificaIndirizzo;
            	var tempUrl = '/clienti/'+pIdCliente+'/indirizzi/'+pIdIndirizzo;      	
            	
            	 return $http({
               	     method: 'PUT',
                     url: tempUrl ,
                     data:  p_body   	  
               });
            	
            },
            getIndirizzoClienteById : function(pIdCliente, pIdIndirizzo){                        
                
            	var tempUrl = '/clienti/'+pIdCliente+'/indirizzi/'+pIdIndirizzo;  	
            	
            	 return $http({
               	     method: 'GET',
                     url: tempUrl  	  
               });
            	
            },
            deleteIndirizzoCliente : function(pIdCliente, pIdIndirizzo){            	
            	var tempUrl = '/clienti/'+pIdCliente+'/indirizzi/'+pIdIndirizzo;
            	
            	 return $http({
               	  method: 'DELETE',
               	  url: tempUrl        	  
               });
            	
            },
            getAppuntamentiCli : function(pIdCliente, pNuovoAppuntamento){                        
                
               var tempUrl = '/clienti/'+pIdCliente+'/appuntamenti';         
               
                return $http({
                       method: 'GET',
                     url: tempUrl        
               });
            },
            createAppuntamentoCli : function(pIdCliente, pNuovoAppuntamento){                        
                
               var tempUrl = '/clienti/'+pIdCliente+'/appuntamenti';         
               
                return $http({
                       method: 'POST',
                     url: tempUrl ,
                     data:  pNuovoAppuntamento        
               });
            },
             getClientiWithContracts : function(){                        
                
              var tempUrl = '/contrattiManutenzione/clienti';        
              
               return $http({
                     method: 'POST',
                     url: tempUrl       
               });
              
            },
             getElencoContratti : function(p_id){                        
                
              var tempUrl = '/clienti/'+p_id+'/contracts';        
              
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
            salvaContrattoCliente : function(pIdCliente, pNuovoContratto){                        
                
              var tempUrl = '/clienti/'+pIdCliente+'/contracts';        
              
               return $http({
                     method: 'POST',
                     url: tempUrl ,
                     data:  pNuovoContratto       
               });
              
            },
            getContrattoClienteById : function(pIdCliente, pIdContratto){              
              var tempUrl = '/clienti/'+pIdCliente+'/contracts/'+pIdContratto;
              
               return $http({
                  method: 'GET',
                  url: tempUrl         
               });
              
            },
            aggiornaContrattoCliente : function(pIdCliente, pModificaContratto, pIdContratto){                        
                
              var tempUrl = '/clienti/'+pIdCliente+'/contracts/'+pIdContratto;        
              
               return $http({
                     method: 'PUT',
                     url: tempUrl ,
                     data:  pModificaContratto       
               });
              
            },
            creaFatturaDaContratto : function(pIdCliente, pFatturaContratto, pIdContratto){
                
              var tempUrl = '/contrattiManutenzione/'+pIdCliente+'/contracts/'+pIdContratto+'/fattura';        
              
               return $http({
                     method: 'POST',
                     url: tempUrl ,
                     data:  pFatturaContratto       
               });
              
            }
        }
    });