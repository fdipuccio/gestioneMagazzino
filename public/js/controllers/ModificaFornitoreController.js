angular.module("gestionaleApp")
.controller("ModificaFornitoreController",
 ['$scope','$uibModalInstance','filterFilter','$sessionStorage','FornitoreService','CommonService',
 function ($scope, $uibModalInstance, filterFilter,$sessionStorage, FornitoreService, CommonService) {
	 'use strict';
		
	$scope.listaIvaApplicata = $sessionStorage.listaIvaApplicata;	
		

	//typeahead
	$scope.elencoComuni = [];

	// START PUBLIC FUNCTIONS

	$scope.updateFornitoreButton = function () {
				updateFornitore($uibModalInstance);
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
			
		}
	}
	//funzione richiamata quando si seleziona un comune dal typeahead
	$scope.onSelectSupplier = function ($item, $model, $label) {
		if($item != null){
				$scope.transient.editFornitore.citta = $item.COMUNE;
				$scope.transient.editFornitore.cap = $item.CAP;	
				$scope.transient.editFornitore.provincia = $item.COD_PROVINCIA;

		} else {
				$scope.transient.editFornitore.citta = "";
				$scope.transient.editFornitore.cap = "";
				$scope.transient.editFornitore.provincia = "";
		}
	}

	// END PUBLIC FUNCTIONS

	//init page
	
	
	//PRIVATE FUNCTIONS

	//funzione di creazione fornitore
	function updateFornitore($uibModalInstance){		
		FornitoreService.updateFornitore($scope.idFornitoreSelezionato,$scope.transient.editFornitore).then(function(response) {  

			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				$scope.getAdvSearchFornitoriList(); 
				$uibModalInstance.dismiss('cancel');
				toastr.success("Operazione terminata con successo" );

			} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}		

		});
	}
   

}]);

