angular.module("gestionaleApp")
.controller("ModificaFornitoreController",
 ['$scope','$uibModalInstance','filterFilter','$sessionStorage','FornitoreService','CommonService',
 function ($scope, $uibModalInstance, filterFilter,$sessionStorage, FornitoreService, CommonService) {
	 'use strict';
		
	$scope.listaIvaApplicata = $sessionStorage.listaIvaApplicata;	
		

	
	//$scope.transient.editFornitore.conto = {};
	//typeahead
	$scope.elencoComuni = [];

	// START PUBLIC FUNCTIONS

	$scope.updateFornitoreButton = function () {
				modificaFornitore($uibModalInstance);
			};		
	$scope.cancelEditFornitoreButton = function () {
		//$uibModalInstance.close(false);
		$uibModalInstance.dismiss('cancel');
	};

	//funzione richiamata sull'onchange del campo type ahead dei comuni
	$scope.getComuniWithTypeAhead = function (){
		if($scope.transient.editFornitore.cittaObject !== null && 
			$scope.transient.editFornitore.cittaObject !== '' &&
			$scope.transient.editFornitore.cittaObject.length > 2){
				//TODO sostituire con servizio
			CommonService.getListaComuniAvanzata($scope.transient.editFornitore.cittaObject).then(function(response) {  		
				if(response!=null && response.data != null){
					$scope.elencoComuni = response.data;	    	
				}    	
			});	
		} else {
				$scope.transient.editFornitore.citta = "";
				$scope.transient.editFornitore.cap = "";
				$scope.transient.editFornitore.provincia = "";
				$scope.transient.editFornitore.idComune = "";
			//	$scope.transient.editFornitore.regione = "";
		}
	}
	//funzione richiamata quando si seleziona un comune dal typeahead
	$scope.onSelectSupplier = function ($item, $model, $label) {
		if($item != null){
			
				$scope.transient.editFornitore.citta = $item.COMUNE;
				$scope.transient.editFornitore.cap = $item.CAP;	
				$scope.transient.editFornitore.provincia = $item.COD_PROVINCIA;
				$scope.transient.editFornitore.regione = $item.COD_REGIONE;	
				$scope.transient.editFornitore.idComune = $item.IDCOMUNE;
		} else {
				$scope.transient.editFornitore.citta = "";
				$scope.transient.editFornitore.cap = "";
				$scope.transient.editFornitore.provincia = "";
				$scope.transient.editFornitore.regione = "";
				$scope.transient.editFornitore.idComune = "";
		}
	}

	// END PUBLIC FUNCTIONS

	//init page
	
	
	//PRIVATE FUNCTIONS

	//funzione di modifica fornitore
	function modificaFornitore($uibModalInstance){		
		console.log("editFornitore");	
		//TODO gestire meglio				
		FornitoreService.updateFornitore($scope.idFornitoreSelezionato, $scope.transient.editFornitore).then(function(response) {  

			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){

				console.log("fornitore creato"); 
				$uibModalInstance.dismiss('cancel');
				$scope.$parent.getAdvSearchFornitoriList(); 	

			}  else {
				if(handleResponseResult.errorCode == 'FORN001'){
					toastr.warning(handleResponseResult.message);
				} else {
					toastr.error("Errore modifica fornitore");		
				}						
			}    	

	    	if(response!=null && response.statusText == "OK" && response.data !== null){
				
					
	    	} else {
							
			}    	
		});
	}
	
}]);

