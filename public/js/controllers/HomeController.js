angular.module("gestionaleApp")
.controller("HomeController",
['$scope','CommonService','$rootScope','$sessionStorage', 
function ($scope,CommonService,rootScope,$sessionStorage) {
   'use strict';

	 $scope.messaggio = "Accedi alle funzionalità tramite il menu sulla sinistra";
      
  

	//quando atterriamo nella home page, carichiamo alcune liste da mettere in sessione
	$scope.getListaDiametro = function (){
    //invocazione service
    /*
		CommonService.getListaDiametro().then(function(response) {  
	    	if(response!=null && response.statusText == "OK" && response.data != null){
				$sessionStorage.listaDiametro = response.data;
	    	}    	
      });		
		  */
		  
	  	$sessionStorage.listaUdmDiametro = [{"DESCRIZIONE":"mm"}];

	}	
  

	$scope.getListaLunghezza = function (){
    //invocazione service
    /*
		CommonService.getListaDiametro().then(function(response) {  
	    	if(response!=null && response.statusText == "OK" && response.data != null){
				$sessionStorage.listaDiametro = response.data;
	    	}    	
      });		
		  */
		  
	  	$sessionStorage.listaUdmLunghezza = [{"DESCRIZIONE":"cm"}];

	}

	$scope.getListaCategorie = function (){
    //invocazione service
    /*
		CommonService.getListaDiametro().then(function(response) {  
	    	if(response!=null && response.statusText == "OK" && response.data != null){
				$sessionStorage.listaDiametro = response.data;
	    	}    	
      });		
		  */
		  
	  	$sessionStorage.listaCategorie = [{"ID_CATEGORIA":"1","NOME_CATEGORIA":"CAT1"}];

	}

	$scope.getListaQtyScatola = function (){
    //invocazione service
    /*
		CommonService.getListaDiametro().then(function(response) {  
	    	if(response!=null && response.statusText == "OK" && response.data != null){
				$sessionStorage.listaDiametro = response.data;
	    	}    	
      });		
		  */
		  
	  	$sessionStorage.listaQtyScatola = [{"DESCRIZIONE":"litri"}];

	}

	if($sessionStorage.listaUdmDiametro === undefined || $sessionStorage.listaUdmDiametro === null){
		$scope.getListaDiametro();	
	}
	if($sessionStorage.listaUdmLunghezza === undefined || $sessionStorage.listaUdmLunghezza === null){
		$scope.getListaLunghezza();	
	}
	if($sessionStorage.listaCategorie === undefined || $sessionStorage.listaCategorie === null){
		$scope.getListaCategorie();	
	}
	if($sessionStorage.listaQtyScatola === undefined || $sessionStorage.listaQtyScatola === null){
		$scope.getListaQtyScatola();	
	}
	
  
  //INIT PAGE
 

}]);

