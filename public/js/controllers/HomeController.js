angular.module("gestionaleApp")
.controller("HomeController",
['$scope','CommonService','ArticoliService','CategorieService','ScadenzeService','$rootScope','$sessionStorage', 
function ($scope,CommonService,ArticoliService,CategorieService,ScadenzeService,$rootScope,$sessionStorage) {
   'use strict';

	 $scope.messaggio = "Accedi alle funzionalità tramite il menu sulla sinistra";
      
	 $rootScope.scadenzeList = [];
	 $rootScope.scadenzeListQty = [];
	 //TODO Al momento mocked dopo cancellare e decommentare le chiamate in INIT PAGE 
     $scope.articoli = [{"idArticolo": 1,"codiceArticolo": "aaaa","descrizioneArticolo": "bentelan","dataScadenza": "01/09/2018"},{"idArticolo": 2,"codiceArticolo": "cccc","descrizioneArticolo": "tachipirina","dataScadenza": "01/02/2019"}];
     $scope.articoliQty = [{"idArticolo": 3,"codiceArticolo": "bbbb","descrizioneArticolo": "sciroppo","qty": 10}];
     
     var articolo = {};
     angular.forEach($scope.articoli, function(item){
        if(tempoRimasto(item.dataScadenza).giorni >= 0){
            
            var dd = tempoRimasto(item.dataScadenza).giorni;
            articolo.articolo = item.descrizioneArticolo;
            if(dd == 0){
              articolo.icon = 'fa fa-bolt';
              articolo.label = 'label-danger';
            }else if(dd > 0 && dd <=20){
              articolo.icon = 'fa fa-bell-o';
              articolo.label = 'label-warning';
            }else if(dd > 20 && dd <=50){
              articolo.icon = 'fa fa-bullhorn';
              articolo.label = 'label-success';
            }else if(dd > 50 && dd <=100){
              articolo.icon = 'fa fa-bullhorn';
              articolo.label = 'label-info';
            }else{
              articolo.icon = 'fa fa-bell-o';
              articolo.label = 'label-default';
            }

            articolo.deadline = dd>0?(dd>1?dd + ' giorni ':dd + ' giorno '):'' + hh>0?(hh>1?hh + ' ore ':hh + ' ora '):'' + mm>0?mm + ' min ':'scaduto ' + mm.replace("-", "") + ' min fa';
            articolo.dataScadenza = item.dataScadenza;
            $rootScope.scadenzeList.push(articolo);
        }
    }); 

    var articoloQty = {};
    angular.forEach($scope.articoliQty, function(item){
      articoloQty.articolo = item.descrizioneArticolo;
           if(item.qty == 0){
            articoloQty.icon = 'fa fa-bolt';
            articoloQty.label = 'label-danger';
           }else if(item.qty > 0 && item.qty <=20){
            articoloQty.icon = 'fa fa-bell-o';
            articoloQty.label = 'label-warning';
           }else if(item.qty > 20 && item.qty <=50){
            articoloQty.icon = 'fa fa-bullhorn';
            articoloQty.label = 'label-success';
           }else if(item.qty > 50 && item.qty <=100){
            articoloQty.icon = 'fa fa-bullhorn';
            articoloQty.label = 'label-info';
           }else{
            articoloQty.icon = 'fa fa-bell-o';
            articoloQty.label = 'label-default';
           }

           articoloQty.qty = item.qty>0?(item.qty>1?item.qty + ' pezzi ':item.qty + ' pezzo '):'non disponibile';
           $rootScope.scadenzeListQty.push(articoloQty);
    }); 

    //funzione che recupera la lista delle scadenze
    $scope.getScadenzeList = function (){
        //invocazione service recupero scadenzeList
        ScadenzeService.getScadenzeList().then(function(response) {

            var handleResponseResult = $scope.handleResponse(response);  
            if(handleResponseResult.next){              
            $rootScope.scadenzeList = [];
            var articolo = {};
            angular.forEach(response.data.articoli, function(item){
               if(tempoRimasto(item.dataScadenza).giorni >= 0){
                   
                   var dd = tempoRimasto(item.dataScadenza).giorni;
                   articolo.articolo = item.descrizioneArticolo;
                   if(dd == 0){
                     articolo.icon = 'fa fa-bolt';
                     articolo.label = 'label-danger';
                   }else if(dd > 0 && dd <=20){
                     articolo.icon = 'fa fa-bell-o';
                     articolo.label = 'label-warning';
                   }else if(dd > 20 && dd <=50){
                     articolo.icon = 'fa fa-bullhorn';
                     articolo.label = 'label-success';
                   }else if(dd > 50 && dd <=100){
                     articolo.icon = 'fa fa-bullhorn';
                     articolo.label = 'label-info';
                   }else{
                     articolo.icon = 'fa fa-bell-o';
                     articolo.label = 'label-default';
                   }
       
                   articolo.deadline = dd>0?(dd>1?dd + ' giorni ':dd + ' giorno '):'';
                   articolo.dataScadenza = item.dataScadenza;
                   $rootScope.scadenzeList.push(articolo);
               }
           }); 
          
            } else {
                toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
            }

        });
    }

    //funzione che recupera la lista delle scadenze
    $scope.getScadenzeListQty = function (){
		//invocazione service recupero scadenzeList
		ScadenzeService.getScadenzeListQty().then(function(response) {

			var handleResponseResult = $scope.handleResponse(response);  
			if(handleResponseResult.next){              
			$rootScope.scadenzeListQty = [];
			var articoloQty = {};
			angular.forEach($scope.articoliQty, function(item){
				articoloQty.articolo = item.descrizioneArticolo;
					if(item.qty == 0){
					articoloQty.icon = 'fa fa-bolt';
					articoloQty.label = 'label-danger';
					}else if(item.qty > 0 && item.qty <=20){
					articoloQty.icon = 'fa fa-bell-o';
					articoloQty.label = 'label-warning';
					}else if(item.qty > 20 && item.qty <=50){
					articoloQty.icon = 'fa fa-bullhorn';
					articoloQty.label = 'label-success';
					}else if(item.qty > 50 && item.qty <=100){
					articoloQty.icon = 'fa fa-bullhorn';
					articoloQty.label = 'label-info';
					}else{
					articoloQty.icon = 'fa fa-bell-o';
					articoloQty.label = 'label-default';
					}
		
					articoloQty.qty = item.qty>0?(item.qty>1?item.qty + ' pezzi ':item.qty + ' pezzo '):'non disponibile';
					$rootScope.scadenzeListQty.push(articoloQty);
			}); 
			
			} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}

		});
	}


    

	//quando atterriamo nella home page, carichiamo alcune liste da mettere in sessione
	$scope.getListaDiametro = function (){
    	//invocazione service    
		CommonService.getListaDiametro().then(function(response) {  
	    	if(response!=null && response.statusText == "OK" && response.data != null){
				$sessionStorage.listaUdmDiametro = response.data;
	    	}    	
      	});	
	}	
  

	$scope.getListaLunghezza = function (){
    	//invocazione service    
		CommonService.getListaLunghezza().then(function(response) {  
	    	if(response!=null && response.statusText == "OK" && response.data != null){
				$sessionStorage.listaUdmLunghezza = response.data;
	    	}    	
      	});
	}
	
	//funzione che recupera la lista di tutti le categorie
	$scope.getCategorieArticoliList = function (){
		//invocazione service
		CategorieService.getCategorieList().then(function(response) {
			
			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				$sessionStorage.listaCategorie = response.data.categorie;						
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}	    	  	
	    });		
	}

	$scope.getListaQtyScatola = function (){
    	//invocazione service    
		CommonService.getListaQtyScatola().then(function(response) {  
	    	if(response!=null && response.statusText == "OK" && response.data != null){
				$sessionStorage.listaQtyScatola = response.data;
	    	}    	
      	});
	}

	$scope.getListaColori = function (){
    	//invocazione service    
		CommonService.getListaColori().then(function(response) {  
	    	if(response!=null && response.statusText == "OK" && response.data != null){
				$sessionStorage.listaColori = response.data.colori;
	    	}    	
      	});
	}

	if($sessionStorage.listaUdmDiametro === undefined || $sessionStorage.listaUdmDiametro === null){
		$scope.getListaDiametro();	
	}
	if($sessionStorage.listaUdmLunghezza === undefined || $sessionStorage.listaUdmLunghezza === null){
		$scope.getListaLunghezza();	
	}
	
	if($sessionStorage.listaCategorie === undefined || $sessionStorage.listaCategorie === null){
		$scope.getCategorieArticoliList();	
	}
	if($sessionStorage.listaQtyScatola === undefined || $sessionStorage.listaQtyScatola === null){
		$scope.getListaQtyScatola();	
	}
	if($sessionStorage.listaColori === undefined || $sessionStorage.listaColori === null){
		$scope.getListaColori();	
	}
	
  
	//INIT PAGE
  //$scope.getScadenzeList();
  //$scope.getScadenzeListQty();
 
  function tempoRimasto(tempo){
	let t = Date.parse(tempo) - Date.parse(new Date());
	let giorni = Math.floor( t/(1000*60*60*24) );
	
	return {
	  'totale': t,
	  'giorni': giorni
	};
  }


}]);

