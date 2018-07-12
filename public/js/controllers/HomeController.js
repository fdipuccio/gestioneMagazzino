angular.module("gestionaleApp")
.controller("HomeController",
['$scope','CommonService','ArticoliService','$rootScope','$sessionStorage', 
function ($scope,CommonService,ArticoliService,rootScope,$sessionStorage) {
   'use strict';

	 $scope.messaggio = "Accedi alle funzionalità tramite il menu sulla sinistra";
      
  

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
		ArticoliService.getCategorieArticoliList().then(function(response) {
			
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
 

}]);

