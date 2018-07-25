angular.module("gestionaleApp").factory('ArticoliService', function($http) {
        return {
            getArticoliList : function(){            	
            	var tempUrl = '/articoli';                	
            	
            	 return $http({
               	  method: 'GET',
               	  url: tempUrl        	  
               });
            	
            },
            removeArticolo : function(p_id){            	
            	var tempUrl = '/articoli/'+p_id;                	
            	
            	 return $http({
               	  method: 'DELETE',
               	  url: tempUrl        	  
               });
            	
            },
            getArticoloByCodice : function(idCliente,codice,tipoFattura){            	
            	var tempUrl = '/articoli/code/'+encodeURIComponent(codice)+'/cliente/'+idCliente+'/tipofattura/'+tipoFattura;                	
            	
            	 return $http({
               	  method: 'GET',
               	  url: tempUrl        	  
               });
            	
            },
            getArticoloById : function(idArticolo){            	
            	var tempUrl = '/articoli/'+idArticolo;                	
            	
            	 return $http({
               	  method: 'GET',
               	  url: tempUrl        	  
               });
            	
            },
            getArticoliByRicercaAvanzata : function(filterObj, ivaProd, ivaServ){        
                var pbody = {};
                 pbody.filter = filterObj;	
                 pbody.ivaProdotto = ivaProd;
                 pbody.ivaServizio = ivaServ;
            	var tempUrl = '/articoli/advancedsearch';                	
            	
            	 return $http({
               	  method: 'POST',
                  url: tempUrl,
                  data: pbody        	  
               });
            	
            },
            getArticoliPerAssociazioneFornitore : function(filterObj, ivaProd, ivaServ){        
                var pbody = {};
                 pbody.filter = filterObj;	
                 pbody.ivaProdotto = ivaProd;
                 pbody.ivaServizio = ivaServ;
                var tempUrl = '/articoli/acquisto/advancedsearch/association';                                	
            	
            	 return $http({
               	  method: 'POST',
                  url: tempUrl,
                  data: pbody        	  
               });
            	
            },
            getAdvSearchArticoliList : function(filter){              
              var tempUrl = '/articoli/search';                 
              
               return $http({
                  method: 'POST',
                  url: tempUrl,
                  data : filter          
               });
              
            },
           
            /*updateUser : function(editUser){            	
            	var tempUrl = '/users/updateuser/'+editUser.IDUTENTE;                	
                
                var p_body = {};
                
                p_body.username = editUser.USERNAME;
                p_body.password = editUser.PASSWORD;
                p_body.email = editUser.EMAIL;
                p_body.enabled = editUser.ENABLED;
                p_body.force_change_pwd = editUser.FORCE_CHANGE_PWD;
                p_body.idprofilo = editUser.IDPROFILO;

            	 return $http({
               	  method: 'PUT',
                  url: tempUrl,
                  data:p_body        	  
               });
            	
            },*/
            /*getUserById : function(p_id){            	
            	var tempUrl = '/users/'+p_id;             	
            	 return $http({
               	  method: 'GET',
               	  url: tempUrl        	  
               });
            	
            },*/
            createArticolo : function(newArticolo){
                var p_body = {};                
                
                p_body.articolo = newArticolo;



            	var tempUrl = '/articoli';                	
            	
            	 return $http({
               	     method: 'POST',
                     url: tempUrl,
                     data:  p_body      	  
               });  
            	
            },
            editArticolo : function(editArticolo) {
                var p_body = {};                 
                
            	var tempUrl = '/articoli/updateArticolo/'+editArticolo.ID_ARTICOLO;                	
            	
            	 return $http({
               	     method: 'PUT',
                     url: tempUrl,
                     data:  editArticolo      	  
               });
            	
            },            
            getArticoloByCodiceAndFornitore : function(idFornitore,codice){            	
            	var tempUrl = '/articoli/code/'+encodeURIComponent(codice)+'/fornitore/'+idFornitore;                	
            	 return $http({
               	  method: 'GET',
               	  url: tempUrl        	  
               });
            	
            },            
            getAlertArticoliQty : function(idFornitore,codice){            	
            	var tempUrl = '/home/alert/quantita';                	
            	 return $http({
               	  method: 'GET',
               	  url: tempUrl        	  
               });
            	
            },            
            getAlertArticoliScadenza : function(idFornitore,codice){            	
            	var tempUrl = '/home/alert/scadenza';                	
                return $http({
               	  method: 'GET',
               	  url: tempUrl        	  
               });
            	
            },          
            getArticoliFornitoriByRicercaAvanzata : function(filterObj, ivaProd, ivaServ){        
                var pbody = {};
                 pbody.filter = filterObj;	
                 pbody.ivaProdotto = ivaProd;
                 pbody.ivaServizio = ivaServ;
            	var tempUrl = '/articoli/acquisto/advancedsearch';                	
            	
            	 return $http({
               	  method: 'POST',
                  url: tempUrl,
                  data: pbody        	  
               });
            	
            },
            caricoQuantitaArticolo : function(idArticolo, pLotto){        
                var pbody = {};
                pbody.lotto = pLotto;
            	var tempUrl = '/articoli/carico/'+idArticolo;                	
            	
            	 return $http({
               	  method: 'POST',
                  url: tempUrl,
                  data: pbody        	  
               });
            },
            scaricoQuantitaArticolo : function(idArticolo, pLotto){        
                var pbody = {};
                pbody.lotto = pLotto;
            	var tempUrl = '/articoli/scarico/'+idArticolo;                	
            	
            	 return $http({
               	  method: 'POST',
                  url: tempUrl,
                  data: pbody        	  
               });
            },            
            getGraphAndamentoArticolo : function(idArticolo){ 
                var pbody = {};
                pbody.idArticolo = idArticolo;
                pbosy.startDate = "01/01/2018";
                pbosy.endDate = "31/12/2018";       	
            	var tempUrl = '/articoli/andamentoprezzo';                	
                return $http({
               	  method: 'POST',
               	  url: tempUrl,
                  data: pbody       	  
               });
            },            
            getGraphCaricoScarico : function(idArticolo){            	
            	var tempUrl = '/articoli/caricoscarico/'+idArticolo;                	
                return $http({
               	  method: 'GET',
               	  url: tempUrl        	  
               });
            }
        }
    });