angular.module("gestionaleApp")
.controller("ClienteContiController",
 ['$scope','$uibModal','$uibModalInstance','filterFilter','$sessionStorage','ClienteService','CommonService','DTOptionsBuilder', 'DTColumnDefBuilder',
 function ($scope, $uibModal, $uibModalInstance, filterFilter,$sessionStorage, ClienteService, CommonService, DTOptionsBuilder, DTColumnDefBuilder) {
	 'use strict';
		
	$scope.transient = {};	
	$scope.transient.nuovoConto = {};
	
	$scope.conti = [];

	$scope.dtOptions = DTOptionsBuilder.newOptions()	
	.withOption('responsive', true)
	.withOption('paging', false)
	.withOption('lengthChange', false)
	.withOption('bInfo', false)	
	.withOption('order', [])
	.withOption('bFilter', false)
	.withLanguageSource('//cdn.datatables.net/plug-ins/1.10.16/i18n/Italian.json');
	$scope.dtColumnDefs = [          
		DTColumnDefBuilder.newColumnDef(0).withOption('width', '35%'),
		DTColumnDefBuilder.newColumnDef(1).withOption('width', '20%'),		
		DTColumnDefBuilder.newColumnDef(2).withOption('width', '35%'),
		DTColumnDefBuilder.newColumnDef(3).notSortable().withOption('width', '10%')
	];

	// START PUBLIC FUNCTIONS
		
	$scope.cancelClienteContiButton = function () {
		//$uibModalInstance.close(false);
		$uibModalInstance.dismiss('cancel');
	};

	$scope.getElencoConti = function(){		
		ClienteService.getContiByIdCliente($scope.idClienteSelezionato).then(function(response) {
			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				$scope.conti = response.data.accounts;	 						
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}    	
		});
	}

	$scope.createNewContoButton = function(){
		var vm = this;		
		ClienteService.salvaContoCliente($scope.idClienteSelezionato,$scope.transient.nuovoConto).then(function(response) {
			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				vm.newContoForm.$setPristine();
				$scope.getElencoConti();	
				$scope.transient.nuovoConto = {}; 						
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}    	
		});
	}
	//al momento non invocata perchè già in modale
	$scope.askConfirmationDeleteConto = function(p_id) {
    var message = "Sei sicuro di voler eliminare questo conto?";
    var modalHtml = '<div class="modal-body">' + message + '</div>';
    modalHtml += '<div class="modal-footer"><button class="btn btn-primary" ng-click="confirmDeleteContoCliente()">OK</button><button class="btn btn-warning" ng-click="cancelDeleteConto()">Cancel</button></div>';

    $uibModal.open({
		template: modalHtml,
		scope:$scope,	
		backdrop:'static',	
		controller: function ($scope, $uibModalInstance) {
			$scope.confirmDeleteContoCliente = function () {
				$scope.removeContoCliente(p_id);
				$uibModalInstance.dismiss('cancel');
			};		
			$scope.cancelDeleteConto = function () {
				//$uibModalInstance.close(false);
				$uibModalInstance.dismiss('cancel');
			};
		}
		}).result.catch(function(res) {
			if (!(res === 'cancel' || res === 'escape key press')) {
				throw res;
			}
		});    
  	};

	$scope.removeContoCliente = function (p_id){
		console.log("removeContoCLiente = " + p_id);
		ClienteService.deleteContoCliente(p_id).then(function(response) {  
	    	var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				$scope.getElencoConti();	
				$scope.transient.nuovoConto = {}; 						
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}     	
	    });				
	}

	// END PUBLIC FUNCTIONS

	//init page
	$scope.getElencoConti();
	
	//PRIVATE FUNCTIONS

	
	
	
}]);

