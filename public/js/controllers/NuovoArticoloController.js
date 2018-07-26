angular.module("gestionaleApp")
.controller("NuovoArticoloController",
 ['$scope','$uibModal','$uibModalInstance','filterFilter','$sessionStorage','ArticoliService','CommonService', 'DTOptionsBuilder', 'DTColumnDefBuilder',
 function ($scope, $uibModal, $uibModalInstance, filterFilter, $sessionStorage, ArticoliService, CommonService, DTOptionsBuilder, DTColumnDefBuilder) {
	 'use strict';
	$scope.model ={};	
	$scope.articoli = [];		
	$scope.transient = {};
	$scope.transient.newArticolo = {};	
	$scope.transient.newArticolo.minimoMagazzino=0;//default 0 
	$scope.transient.newArticolo.timerScadenza=0;//default 0 
	$scope.transient.newArticolo.idCategoria = "";//default nessuna categoria 
	$scope.listaQtyScatola = $sessionStorage.listaQtyScatola;
	$scope.listaUdmDiametro = $sessionStorage.listaUdmDiametro;
	$scope.listaUdmLunghezza = $sessionStorage.listaUdmLunghezza;
	$scope.listaCategorie = $sessionStorage.listaCategorie;
	$scope.listaColori = $sessionStorage.listaColori;
	$scope.transient.flagCodiceBarreGenerato = false;


	if($scope.codiceBarreFromCaricoScarico !==undefined && $scope.codiceBarreFromCaricoScarico!==null){
		$scope.transient.newArticolo.codiceBarre = $scope.codiceBarreFromCaricoScarico;
	}

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


	$scope.generaCodiceBarreManuale = function (){
		
		$scope.transient.flagCodiceBarreGenerato = true;

		ArticoliService.generaBarCode().then(function(response) { 
			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				console.log("codice a barre generato");  			
				$scope.transient.newArticolo.codiceBarre  = response.data.barcode;		
			} else {
				toastr.error("ERRORE ARTICOLO GENERICO");		
			}
				   	 
		});

	}
	
	$scope.resetCodiceBarreManuale = function (){
		$scope.transient.newArticolo.codiceBarre  = '';
		$scope.transient.flagCodiceBarreGenerato = false;
	}

	
	// END PUBLIC FUNCTIONS

	//init page
		
	
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
