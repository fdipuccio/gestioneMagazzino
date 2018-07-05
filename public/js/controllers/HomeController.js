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
	}	
  

	if($sessionStorage.listaDiametro === undefined || $sessionStorage.listaDiametro === null){
		$scope.getListaDiametro();	
	}
	
  
  //INIT PAGE
 

}]);

