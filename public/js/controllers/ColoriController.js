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
	

	
	//open modale di inserimento categoria
	$scope.openModalNewColore = function () {
		$scope.transient.newCategoria = {};	
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
    var message = "Sei sicuro di voler eliminare questa categoria?";
    var modalHtml = '<div class="modal-body">' + message + '</div>';
    modalHtml += '<div class="modal-footer"><button class="btn btn-primary" ng-click="confirmDeleteCategoria()">OK</button><button class="btn btn-warning" ng-click="cancelDelete()">Cancel</button></div>';

    $uibModal.open({
		template: modalHtml,
		scope:$scope,	
		backdrop:'static',	
		controller: function ($scope, $uibModalInstance) {
			$scope.confirmDeleteCategoria = function () {
				$scope.removeCategoria(p_id);
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


	$scope.removeCategoria = function (p_id){
		console.log("removeCategoria = " + p_id);
		CategorieService.removeCategoria(p_id).then(function(response) {  
	    	if(response!=null && response.data != null){
				console.log("categoria eliminata"); 
				$scope.getListaCategorie(); 		
	    	} else {
				toastr.error("TODO - GESTIONE ERRORE");
			}    	
	    });				
	}

	// END PUBLIC FUNCTIONS
	
	

//open modale di modifica categoria
$scope.openModalEditCategoria = function (idCategoria) {

	//recupero dettaglio categoria
	CategorieService.getCategoriaById(idCategoria).then(function(response) {  

		var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				$scope.transient.editCategoria = response.data.categoria[0];									
	    	} else {
				toastr.error("TODO - GESTIONE ERRORE");
			}		    	
	});	

	
	$uibModal.open({
	templateUrl: './html/categorie/modalEditCategoria.html',
	scope:$scope,	
	backdrop:'static',
	size: 'lg',	
	controller: function ($scope, $uibModalInstance) {
		$scope.updateEditCategoriaButton = function () {
			modifyCategoria($uibModalInstance);
		};		
		$scope.cancelEditCategoriaButton = function () {
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

function modifyCategoria($uibModalInstance){
	console.log("modifyCategoria");	
	//adding default values
	CategorieService.editCategoria($scope.transient.editCategoria).then(function(response) { 
		
		var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				console.log("categoria modificata"); 
				$uibModalInstance.dismiss('cancel');
			$scope.getListaCategorie();						
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}		    	
	});
}


//init page
$scope.getListaColori();


}]);
