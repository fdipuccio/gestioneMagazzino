angular.module("gestionaleApp")
.controller("PagamentoMassivoFattureController",
 ['$scope','$uibModal','$uibModalInstance','$sessionStorage', 'FattureService',
 function ($scope, $uibModal, $uibModalInstance,$sessionStorage, FattureService) {
	'use strict';
	
	$scope.elencoFattureSelezionate = "";
	$scope.elencoConti = $sessionStorage.listaContiAzienda;
	$scope.massivo = {};
	$scope.massivo.pagamento = [];
    $scope.massivo.idConto = "";
	$scope.massivo.datamovimento = "";

	var i = 0;
	angular.forEach($scope.fatture, function(item){
		if(item.checked){
			//elenco fatture da mostrare
			if(i == 0){
				$scope.elencoFattureSelezionate+=item.NUMERO + "/" + item.ANNO_RIF;
				
			} else {
				$scope.elencoFattureSelezionate+=" - " + item.NUMERO + "/" + item.ANNO_RIF;	
			}	
			i++;			
			//preparazione request
			var pagamento = {};
			pagamento.idFattura = item.ID_FATTURA;
			pagamento.numeroFattura = item.NUMERO;
			pagamento.annoFattura = item.ANNO_RIF;
			pagamento.totaleFattura = item.TOTALE_FATTURA;
			$scope.massivo.pagamento.push(pagamento);
		}
		
	});
	
	$scope.eseguiPagamentoMassivo = function () {	
		
		FattureService.registaPagamentoMassivo($scope.massivo.pagamento, $scope.massivo.datamovimento, $scope.massivo.idConto).then(function(response) {
			//TODO rimettere handle			  
	    	var handleResponseResult = $scope.handleResponse(response);  
			if(handleResponseResult.next){					
				$scope.getFattureList();
				$uibModalInstance.dismiss('cancel');
			} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - " + handleResponseResult.message );
			}  
		});

		
	};		
	$scope.cancelPagamentoMassimo = function () {
		$uibModalInstance.dismiss('cancel');
	};
	
	// END PUBLIC FUNCTIONS

	
	

}]);

