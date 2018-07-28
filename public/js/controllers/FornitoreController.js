angular.module("gestionaleApp")
.controller("FornitoreController",
 ['$scope','$uibModal','filterFilter','$location','$sessionStorage','FornitoreService','CommonService', 'DTOptionsBuilder', 'DTColumnDefBuilder',
 function ($scope, $uibModal, filterFilter,$location,$sessionStorage, FornitoreService, CommonService, DTOptionsBuilder, DTColumnDefBuilder) {
	 'use strict';
	$scope.model ={};	
	$scope.fornitori = [];		
	
	$scope.transient = {};		
	
	$scope.idFornitoreSelezionato = 0;
	
	$scope.dtOptions = DTOptionsBuilder.newOptions().withOption('responsive', true).withLanguageSource('//cdn.datatables.net/plug-ins/1.10.16/i18n/Italian.json');
	$scope.dtColumnDefs = [          
		DTColumnDefBuilder.newColumnDef(6).notSortable()
	];

	// START PUBLIC FUNCTIONS

	

	//funzione che recupera la lista dei fornitori con parametri di ricerca
	$scope.getAdvSearchFornitoriList = function (){

		//invocazione service
		$scope.spinner.on();
		FornitoreService.getAdvSearchFornitoriList($scope.filters).then(function(response) {  

			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				$scope.fornitori = response.data.suppliers;									
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}
	    	$scope.spinner.off();  	
	    });		
	}
	//Gestione tasto invio su ricerca fornitore
	$scope.gotoSearch = function(event) {
		if(event.keyCode == 13) {
			$scope.getAdvSearchFornitoriList();
		}
	}

	//open modale di inserimento utente
	$scope.openModalNewFornitore = function () {
		$scope.transient.newFornitore = {};
		$uibModal.open({
		templateUrl: './html/fornitori/modalNewFornitore.html',
		scope:$scope,	
		backdrop:'static',
		size: 'lg',	
		controller: 'NuovoFornitoreController'
		}).result.catch(function(res) {
			if (!(res === 'cancel' || res === 'escape key press')) {
				throw res;
			}
		});
 	 };
	
	
	


	//recupero utente ById e apertura modale di modifica
	$scope.openModalEditFornitore = function (p_id) {
		$scope.idFornitoreSelezionato = p_id;
		//recupero utente
		FornitoreService.getFornitoreById(p_id).then(function(response) {  
	    	var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				$scope.transient.editFornitore = response.data.supplier;						
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}    	
	    });	

		//apertura modale
		$uibModal.open({
		templateUrl: './html/fornitori/modalEditFornitore.html',
		scope:$scope,
		backdrop:'static',
		size: 'lg',		
		controller: 'ModificaFornitoreController'
		}).result.catch(function(res) {
			if (!(res === 'cancel' || res === 'escape key press')) {
				throw res;
			}
		});
 	 };

	$scope.askConfirmationDelete = function(p_id) {
    var message = "Sei sicuro di voler eliminare questo fornitore?";
    var modalHtml = '<div class="modal-body">' + message + '</div>';
    modalHtml += '<div class="modal-footer"><button class="btn btn-primary" ng-click="confirmDeleteFornitore()">OK</button><button class="btn btn-warning" ng-click="cancelDelete()">Cancel</button></div>';

    $uibModal.open({
		template: modalHtml,
		scope:$scope,
		backdrop:'static',		
		controller: function ($scope, $uibModalInstance) {
			$scope.confirmDeleteFornitore = function () {
				$scope.removeFornitore(p_id);
				$uibModalInstance.dismiss('cancel');
			};		
			$scope.cancelDelete = function () {
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
	 
	$scope.removeFornitore = function (p_id){
		console.log("removeCLiente = " + p_id);
		FornitoreService.removeFornitore(p_id).then(function(response) {  

			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				toastr.success("Fornitore cancellato correttamente"); 
				$scope.getAdvSearchFornitoriList();									
	    	} else {
				var message = "errore_fornitore_codice_"+handleResponseResult.errorCode;
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - " + $scope.labels[message]);
			}
	    	   	
	    });				
	}

	

 	 
	
	// END PUBLIC FUNCTIONS

	//init page
	$scope.getAdvSearchFornitoriList();
	
	
	//private functions		

	

}]);

