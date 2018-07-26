angular.module("gestionaleApp")
.controller("ColoriController",
 ['$scope','$uibModal','filterFilter','$sessionStorage','ColoriService','CommonService', 'DTOptionsBuilder', 'DTColumnDefBuilder',
 function ($scope, $uibModal, filterFilter, $sessionStorage, ColoriService, CommonService, DTOptionsBuilder, DTColumnDefBuilder) {
	 'use strict';
	$scope.model ={};		
	$scope.transient = {};
	$scope.transient.newColore = {};	
	$scope.transient.editColore = {};	
	$scope.listaColori = [];	
	$scope.dtOptions = DTOptionsBuilder.newOptions().withOption('responsive', true).withLanguageSource('//cdn.datatables.net/plug-ins/1.10.16/i18n/Italian.json');
	$scope.dtColumnDefs = [          
		DTColumnDefBuilder.newColumnDef(0).withOption('width', '40%'),
		DTColumnDefBuilder.newColumnDef(1).withOption('width', '40%'),
		DTColumnDefBuilder.newColumnDef(2).notSortable().withOption('width', '20%')
	];
	
	// START PUBLIC FUNCTIONS

	//funzione che recupera la lista di tutti gli utenti
	$scope.getListaColori = function (){
		//invocazione service
		$scope.spinner.on();
		ColoriService.getColoriList().then(function(response) { 
			
			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				$scope.listaColori = response.data.colori;
				$sessionStorage.listaColori = $scope.listaColori						
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}
	    	$scope.spinner.off();
	    });		
	}
	

	
	//open modale di inserimento colore
	$scope.openModalNewColore = function () {
		$scope.transient.newColore = {};	
		$uibModal.open({
		templateUrl: './html/colori/modalNewColore.html',
		scope:$scope,	
		backdrop:'static',
		size: 'lg',	
		controller: function ($scope, $uibModalInstance) {
			$scope.createNewColoreButton = function () {
				creaColore($uibModalInstance);
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

	//apre popup di conferma cancellazione
	$scope.askConfirmationDelete = function(p_id) {
    var message = "Sei sicuro di voler eliminare questo colore?";
    var modalHtml = '<div class="modal-body">' + message + '</div>';
    modalHtml += '<div class="modal-footer"><button class="btn btn-primary" ng-click="confirmDeleteColore()">OK</button><button class="btn btn-warning" ng-click="cancelDelete()">Cancel</button></div>';

    $uibModal.open({
		template: modalHtml,
		scope:$scope,	
		backdrop:'static',	
		controller: function ($scope, $uibModalInstance) {
			$scope.confirmDeleteColore = function () {
				$scope.removeColore(p_id);
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


	$scope.removeColore = function (p_id){
		console.log("removeColore = " + p_id);
		ColoriService.removeColore(p_id).then(function(response) {  
	    				
			var handleResponseResult = $scope.handleResponse(response);  
			if(handleResponseResult.next){
				toastr.success("Colore cancellato correttamente"); 
				$scope.getListaColori(); 									
	    	} else {
				var message = "errore_colore_codice_"+handleResponseResult.errorCode;
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - " + $scope.labels[message]);
			}

	    });				
	}

	// END PUBLIC FUNCTIONS
	
	

//open modale di modifica colore
$scope.openModalEditColore = function (idColore) {

	//recupero dettaglio colore
	ColoriService.getColoreById(idColore).then(function(response) {  

		var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				$scope.transient.editColore = response.data.colore;									
	    	} else {
				toastr.error("TODO - GESTIONE ERRORE");
			}		    	
	});	

	
	$uibModal.open({
	templateUrl: './html/colori/modalEditColore.html',
	scope:$scope,	
	backdrop:'static',
	size: 'lg',	
	controller: function ($scope, $uibModalInstance) {
		$scope.updateEditColoreButton = function () {
			modifyColore($uibModalInstance);
		};		
		$scope.cancelEditColoreButton = function () {
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

//private functions

function creaColore($uibModalInstance){
	console.log("aggiungiColore");	
	//adding default values
	ColoriService.createColore($scope.transient.newColore).then(function(response) { 
		
		var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				console.log("colore inserito"); 
				$uibModalInstance.dismiss('cancel');				
			$scope.getListaColori();						
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}		    	
	});
}

function modifyColore($uibModalInstance){
	console.log("modifyColore");	
	//adding default values
	ColoriService.editColore($scope.transient.editColore).then(function(response) { 
		
		var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				console.log("colore modificato"); 
				$uibModalInstance.dismiss('cancel');
			$scope.getListaColori();						
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}		    	
	});
}


//init page
$scope.getListaColori();


}]);
