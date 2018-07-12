angular.module("gestionaleApp").factory('CommonService', function($http) {
        return {
            getListaLunghezza : function(){        
                           	
            	var tempUrl = '/udm/lunghezza';               	
            	
            	 return $http({
               	  method: 'GET',
               	  url: tempUrl        	  
               });                           	
            },
            getListaVolume : function(){         
                           	
            	var tempUrl = '/udm/volume';                	
            	
            	 return $http({
               	  method: 'GET',
               	  url: tempUrl        	  
               });                           	
            },
             getListaPeso : function(){         
                           	
            	var tempUrl = '/udm/peso';                	
            	
            	 return $http({
               	  method: 'GET',
               	  url: tempUrl        	  
               });   
                        	
            },
             getListaQtyScatola : function(){         
                           	
            	var tempUrl = '/udm/qtyscatola';                	
            	
            	 return $http({
               	  method: 'GET',
               	  url: tempUrl        	  
               });   
                        	
            },
            getListaCapacita : function(){         
                           	
            	var tempUrl = '/udm/capacita';                	
            	
            	 return $http({
               	  method: 'GET',
               	  url: tempUrl        	  
               });   
                        	
            },
            getListaDiametro : function(){         
                           	
            	var tempUrl = '/udm/diametro';                	
            	
            	 return $http({
               	  method: 'GET',
               	  url: tempUrl        	  
               });   
                        	
			},
			getListaColori : function(){         
                           	
            	var tempUrl = '/colori';                	
            	
            	 return $http({
               	  method: 'GET',
               	  url: tempUrl        	  
               });   
                        	
            }                              
            
        }
    });