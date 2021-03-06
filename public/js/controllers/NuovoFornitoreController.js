angular.module("gestionaleApp")
.controller("NuovoFornitoreController",
 ['$scope','$uibModalInstance','filterFilter','$sessionStorage','FornitoreService','CommonService',
 function ($scope, $uibModalInstance, filterFilter,$sessionStorage, FornitoreService, CommonService) {
	 'use strict';
		
	$scope.listaIvaApplicata = $sessionStorage.listaIvaApplicata;	
		

	$scope.transient = {};
	$scope.transient.newFornitore = {};
	//$scope.transient.newFornitore.conto = {};
	//typeahead
	$scope.elencoComuni = [];

	// START PUBLIC FUNCTIONS

	$scope.createNewFornitoreButton = function () {
				createNewFornitore($uibModalInstance);
			};		
	$scope.cancelNewFornitoreButton = function () {
		//$uibModalInstance.close(false);
		$uibModalInstance.dismiss('cancel');
	};

	//funzione richiamata sull'onchange del campo type ahead dei comuni
	$scope.getComuniWithTypeAhead = function (){
		if($scope.transient.newFornitore.cittaObject !== null && 
			$scope.transient.newFornitore.cittaObject !== '' &&
			$scope.transient.newFornitore.cittaObject.length > 2){
				//TODO sostituire con servizio
			CommonService.getListaComuniAvanzata($scope.transient.newFornitore.cittaObject).then(function(response) {  		
				if(response!=null && response.data != null){
					$scope.elencoComuni = response.data;	    	
				}    	
			});	
		} else {
				$scope.transient.newFornitore.citta = "";
				$scope.transient.newFornitore.cap = "";
				$scope.transient.newFornitore.provincia = "";
			//	$scope.transient.newFornitore.regione = "";
		}
	}
	//funzione richiamata quando si seleziona un comune dal typeahead
	$scope.onSelectSupplier = function ($item, $model, $label) {
		if($item != null){
				$scope.transient.newFornitore.citta = $item.COMUNE;
				$scope.transient.newFornitore.cap = $item.CAP;	
				$scope.transient.newFornitore.provincia = $item.COD_PROVINCIA;
				$scope.transient.newFornitore.regione = $item.COD_REGIONE;	
		} else {
				$scope.transient.newFornitore.citta = "";
				$scope.transient.newFornitore.cap = "";
				$scope.transient.newFornitore.provincia = "";
				$scope.transient.newFornitore.regione = "";
		}
	}

	// END PUBLIC FUNCTIONS

	//init page
	
	
	//PRIVATE FUNCTIONS

	//funzione di creazione fornitore
	function createNewFornitore($uibModalInstance){		
		console.log("createNewFornitore");	
		//TODO gestire meglio		
		FornitoreService.createFornitore($scope.transient.newFornitore).then(function(response) {  

			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){

				console.log("fornitore creato"); 
				$uibModalInstance.dismiss('cancel');
				//a seconda della pagina chiamante, viene invocata la funzione definita sul controller padre
				if($scope.sezioneRichiamante == 'fornitore'){
					$scope.getFornitoriList(); 	
				} else if($scope.sezioneRichiamante == 'nuovaFattura'){
					//aggiorna la lista dei fornitori in pagina
					$scope.getSuppliersList();
					//prevalorizza i dati del nuovo fornitore	
					console.log(response.data.idFornitore.id);				
					$scope.onSelectSupplierPostCreazione(response.data.idFornitore.id);
				} else {
					//TODO altre sezioni
				}

			}  else {
				if(handleResponseResult.errorCode == 'FORN001'){
					toastr.warning(handleResponseResult.message);
				} else {
					toastr.error("ERRORE CREAZIONE FORNITORE");		
				}
						
			}    	

	    	if(response!=null && response.statusText == "OK" && response.data !== null){
				
					
	    	} else {
							
			}    	
		});
	}
	
}]);

