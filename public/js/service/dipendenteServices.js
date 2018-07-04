angular.module("gestionaleApp").factory('DipendenteService', function($http) {
        return {
            getDipendentiList : function(){            	
            	var tempUrl = '/dipendenti';                	
            	
            	 return $http({
               	  method: 'GET',
               	  url: tempUrl        	  
               });
            	
            },
            getAdvSearchDipendentiList : function(filter){              
              var tempUrl = '/dipendenti/advancedsearch';
              
               return $http({
                  method: 'POST',
                  url: tempUrl,
                  data : filter          
               });
              
            },
            removeDipendente : function(p_id){            	
            	var tempUrl = '/dipendenti/'+p_id;
            	
            	 return $http({
               	  method: 'DELETE',
               	  url: tempUrl        	  
               });
            	
            },                  
            createDipendente : function(newDipendente){
                var p_body = {};                
                p_body.dipendente = newDipendente;                
                
            	var tempUrl = '/dipendenti';                	
            	
            	 return $http({
               	     method: 'POST',
                     url: tempUrl,
                     data:  p_body       	  
               });
            	
            },
            getDipendenteByMatricola : function(p_matricola){                        
                
            	var tempUrl = '/dipendenti/'+p_matricola;                	
            	
            	 return $http({
               	     method: 'GET',
                     url: tempUrl    	  
               });
            	
            },
            getDipendenteByIdDettFatt : function(p_id){                        
                
               var tempUrl = '/dipendenti/'+p_id+'?deleted=true';                 
               
                return $http({
                       method: 'GET',
                     url: tempUrl        
               });
               
            },
            updateDipendente : function(p_matricola, editDipendente){                        
                  var p_body = {};                
                  p_body.dipendente = editDipendente; 
            	var tempUrl = '/dipendenti/'+p_matricola;                	
            	
            	 return $http({
               	     method: 'PUT',
                     url: tempUrl ,
                     data:  p_body     	  
               });
            	
            },
            getContiByIdDipendente : function(p_id){                        
               
                 var tempUrl = '/dipendenti/'+p_id+'/account';      	
                 
                  return $http({
                         method: 'GET',
                    url: tempUrl    	  
              });
                 
            },
            getIndirizziByIdDipendente : function(p_id){                        
              
                var tempUrl = '/dipendenti/'+p_id+'/indirizzi';      	
                
                 return $http({
                        method: 'GET',
                   url: tempUrl    	  
             });
                
            },
            salvaContoDipendente : function(pIdDipendente, pNuovoConto){                        
                
            	var tempUrl = '/dipendenti/'+pIdDipendente+'/account';      	
            	
            	 return $http({
               	     method: 'POST',
                     url: tempUrl ,
                     data:  pNuovoConto   	  
               });
            	
            },
            deleteContoDipendente : function(p_id){            	
            	var tempUrl = '/dipendenti/account/'+p_id;                	
            	
            	 return $http({
               	  method: 'DELETE',
               	  url: tempUrl        	  
               });
            	
            },
            creaFatturaDaContratto : function(pIdDipendente, pFatturaContratto, pIdContratto){
                
              var tempUrl = '/contrattiManutenzione/'+pIdDipendente+'/contracts/'+pIdContratto+'/fattura';        
              
               return $http({
                     method: 'POST',
                     url: tempUrl ,
                     data:  pFatturaContratto       
               });
              
            }
        }
    });