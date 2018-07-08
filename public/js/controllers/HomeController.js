angular.module("gestionaleApp")
.controller("HomeController",
['$scope','CommonService','$rootScope','$sessionStorage', 
function ($scope,CommonService,rootScope,$sessionStorage) {
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
	/*
	$scope.getListaCategorie = function (){
    	//invocazione service    
		CommonService.getListaCategorie().then(function(response) {  
	    	if(response!=null && response.statusText == "OK" && response.data != null){
				$sessionStorage.listaCategorie = response.data;
	    	}    	
      	});
		$sessionStorage.listaCategorie = 
	}*/

	$scope.getListaQtyScatola = function (){
    	//invocazione service    
		CommonService.getListaQtyScatola().then(function(response) {  
	    	if(response!=null && response.statusText == "OK" && response.data != null){
				$sessionStorage.listaQtyScatola = response.data;
	    	}    	
      	});
	}

	if($sessionStorage.listaUdmDiametro === undefined || $sessionStorage.listaUdmDiametro === null){
		$scope.getListaDiametro();	
	}
	if($sessionStorage.listaUdmLunghezza === undefined || $sessionStorage.listaUdmLunghezza === null){
		$scope.getListaLunghezza();	
	}
	/*
	if($sessionStorage.listaCategorie === undefined || $sessionStorage.listaCategorie === null){
		$scope.getListaCategorie();	
	}*/
	if($sessionStorage.listaQtyScatola === undefined || $sessionStorage.listaQtyScatola === null){
		$scope.getListaQtyScatola();	
	}
	
  
  //INIT PAGE
 

}]);

