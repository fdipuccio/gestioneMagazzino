angular.module("gestionaleApp")
.controller("NuovoArticoloController",
 ['$scope','$uibModal','$uibModalInstance','filterFilter','$sessionStorage','ArticoliService','CommonService', 'DTOptionsBuilder', 'DTColumnDefBuilder',
 function ($scope, $uibModal, $uibModalInstance, filterFilter, $sessionStorage, ArticoliService, CommonService, DTOptionsBuilder, DTColumnDefBuilder) {
	 'use strict';
	$scope.model ={};	
	$scope.articoli = [];		
	$scope.transient = {};
	$scope.transient.newArticolo = {};	
	$scope.transient.newArticolo.idCategoria = "";//default nessuna categoria 
	$scope.listaQtyScatola = $sessionStorage.listaQtyScatola;
	$scope.listaUdmDiametro = $sessionStorage.listaUdmDiametro;
	$scope.listaUdmLunghezza = $sessionStorage.listaUdmLunghezza;
	$scope.listaCategorie = $sessionStorage.listaCategorie;
	$scope.listaTipologie = [{'DESCRIZIONE':'PRODOTTO'},{'DESCRIZIONE':'SERVIZIO'}];

	// START PUBLIC FUNCTIONS

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
					$scope.getAdvSearchArticoliList(); 
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
