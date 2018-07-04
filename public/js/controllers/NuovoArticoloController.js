angular.module("gestionaleApp")
.controller("NuovoArticoloController",
 ['$scope','$uibModal','$uibModalInstance','filterFilter','$sessionStorage','ArticoliService','CommonService', 'DTOptionsBuilder', 'DTColumnDefBuilder',
 function ($scope, $uibModal, $uibModalInstance, filterFilter, $sessionStorage, ArticoliService, CommonService, DTOptionsBuilder, DTColumnDefBuilder) {
	 'use strict';
	$scope.model ={};	
	$scope.articoli = [];		
	$scope.transient = {};
	$scope.transient.newArticolo = {};	
	$scope.transient.newArticolo.idCategoria = "-1";//default nessuna categoria 	
	$scope.transient.newArticolo.valuta = 'EUR'; //default eur
	$scope.listaIvaApplicata = $sessionStorage.listaIvaApplicata;
	$scope.listaUDM = $sessionStorage.listaUDM;
	$scope.listaValute = $sessionStorage.listaValute;
	$scope.listaCategorie = [];
	$scope.listaTipologie = [{'DESCRIZIONE':'PRODOTTO'},{'DESCRIZIONE':'SERVIZIO'}];

	// START PUBLIC FUNCTIONS

	
	
	//funzione che recupera la lista di tutti le categorie
	$scope.getCategorieArticoliList = function (){
		//invocazione service
		ArticoliService.getCategorieArticoliList().then(function(response) {
			
			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				$scope.listaCategorie = response.data.categorie;						
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}	    	  	
	    });		
	}

	$scope.createNewArticoloButton = function () {
				createNewArticolo($uibModalInstance);
			};		
	$scope.cancelNewArticoloButton = function () {
		//$uibModalInstance.close(false);
		$uibModalInstance.dismiss('cancel');
		if($scope.sezioneRichiamante == 'nuovaFattura'){
			$scope.openModalRicercaArticolo();
		}
	};

	

	
	// END PUBLIC FUNCTIONS

	//init page
	
	$scope.getCategorieArticoliList();
	
	//private functions
	function createNewArticolo($uibModalInstance){
		console.log("createNewArticolo");	
		//adding default values
		ArticoliService.createArticolo($scope.transient.newArticolo).then(function(response) { 
			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				console.log("articolo creato");  
				$uibModalInstance.dismiss('cancel'); 
				if($scope.sezioneRichiamante == 'articoli'){
					$scope.getArticoliList(); 
				} else if($scope.sezioneRichiamante == 'nuovaFattura'){
				$scope.openModalRicercaArticolo($scope.transient.newArticolo.codiceArticolo);
				$scope.eseguiRicercaAvanzata();
				}
						
	    	} else {
				if(handleResponseResult.errorCode == 'ART002'){
					toastr.warning("ARTICOLO GIA PRESENTE");
				} else {
					toastr.error("ERRORE ARTICOLO GENERICO");		
				}
						
			}    	 
		});
	}

}]);
