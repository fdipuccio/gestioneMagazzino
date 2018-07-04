angular.module("gestionaleApp")
.controller("PagamentoMassivoFattureFornitoreController",
 ['$scope','$uibModal','$uibModalInstance','$sessionStorage', 'FattureFornitoriService',
 function ($scope, $uibModal, $uibModalInstance,$sessionStorage, FattureFornitoriService) {
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
		
		FattureFornitoriService.registraPagamentoMassivo($scope.massivo.pagamento, $scope.massivo.datamovimento, $scope.massivo.idConto).then(function(response) {
			//TODO rimettere handle			  
	    	//var handleResponseResult = $scope.handleResponse(response);  
	    	//if(handleResponseResult.next){	
			if(response != null && response.data != null){		
				$scope.getFattureWithFilterList();		
				$uibModalInstance.dismiss('cancel');
			} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}  
		});

		
	};		
	$scope.cancelPagamentoMassimo = function () {
		$uibModalInstance.dismiss('cancel');
	};
	
	// END PUBLIC FUNCTIONS

	
	

}]);

