angular.module("gestionaleApp")
.controller("PagamentoFattureFornitoreController",
 ['$scope','$uibModal','$uibModalInstance','$sessionStorage','filterFilter','$location','$window', 'FattureFornitoriService', '$filter','DTOptionsBuilder', 'DTColumnDefBuilder',
 function ($scope, $uibModal, $uibModalInstance,$sessionStorage, filterFilter, $location, $window, FattureFornitoriService, $filter, DTOptionsBuilder, DTColumnDefBuilder) {
	'use strict';
	
	$scope.elencoRate = [];
	$scope.elencoConti = $sessionStorage.listaContiAzienda;	
	$scope.abilitaInvioMail = false;

	//tabella
	//tabella elenco articoli in fattura
	$scope.dtOptions = DTOptionsBuilder.newOptions()
	.withOption('responsive', true)
	.withOption('paging', false)
	.withOption('lengthChange', false)
	.withOption('bInfo', false)	
	.withOption('order', [])
	.withOption('bFilter', false)
	.withLanguageSource('//cdn.datatables.net/plug-ins/1.10.16/i18n/Italian.json');
	$scope.dtColumnDefs = [          
		DTColumnDefBuilder.newColumnDef(0).notSortable().withOption('width', '14%'),
		DTColumnDefBuilder.newColumnDef(1).notSortable().withOption('width', '16%'),
		DTColumnDefBuilder.newColumnDef(2).notSortable().withOption('width', '16%'),
		DTColumnDefBuilder.newColumnDef(3).notSortable().withOption('width', '18%'),
		DTColumnDefBuilder.newColumnDef(4).notSortable().withOption('width', '22%'),
		DTColumnDefBuilder.newColumnDef(5).notSortable().withOption('width', '14%'),
		
	];

	// START PUBLIC FUNCTIONS

	$scope.cancelPagamentoFattureButton = function () {
		//$uibModalInstance.close(false);
		$uibModalInstance.dismiss('cancel');
		$scope.getFattureWithFilterList($scope.$parent.filters.filter.tipoFattura, $scope.$parent.descTipoFattura);
	};

	$scope.recuperaElencoRate = function (){
	//scadenzario
		FattureFornitoriService.getFatturaScadenzeById($scope.idFattura).then(function(response) {  
	    	var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){			
				$scope.elencoRate = response.data.scadenze;
			$scope.abilitaInvioMail = false;
			angular.forEach($scope.elencoRate, function(item){
				if(item.STATO == 'NON PAGATA'){
					$scope.abilitaInvioMail = true;
				}
			});	

			} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}  
		});	
	};

	$scope.eseguiPagamentoRata = function (rata){
	//scadenzario
	if(rata.dataPagamento == undefined || rata.dataPagamento == "" ||
		rata.idConto == undefined || rata.idConto == ""){
		toastr.error("Data pagamento e conto sono obbligatorie");
	} else {
		var pagamento = {};
		pagamento.idConto = rata.idConto; 
		pagamento.datamovimento = $filter('date')(rata.dataPagamento, "dd/MM/yyyy"); ;
		pagamento.idScadenza = rata.ID;
		FattureFornitoriService.registraPagamento(pagamento, $scope.idFattura).then(function(response) {					  
	    	var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){					
				$scope.recuperaElencoRate();
			} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - " + handleResponseResult.message );
			}  
		});	
	}
		
	};

	$scope.eseguiAnnullamentoRata = function (rata){
	//scadenzario
	
		var pagamento = {};			
		pagamento.idScadenza = rata.ID;
		FattureFornitoriService.annullaPagamento(pagamento, $scope.idFattura).then(function(response) {					  
	    	var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){					
				$scope.recuperaElencoRate();
			} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - " + handleResponseResult.message );
			}  
		});	
	
		
	};


	// END PUBLIC FUNCTIONS

	//init page	
	$scope.recuperaElencoRate();

}]);

