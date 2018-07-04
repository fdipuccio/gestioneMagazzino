angular.module("gestionaleApp")
.controller("UserController", ['$scope','$uibModal','UserService','DTOptionsBuilder', 'DTColumnDefBuilder',
 function ($scope, $uibModal, UserService, DTOptionsBuilder, DTColumnDefBuilder) {
	 'use strict';
	$scope.model ={};	
	$scope.users = [];	
	$scope.transient = [];
	$scope.transient.newUser = {};
	$scope.transient.editUser = {};

	$scope.listaProfili = [{"ID":"1","DESCRIZIONE":"Amministratore"}];

	$scope.dtOptions = DTOptionsBuilder.newOptions().withOption('responsive', true).withLanguageSource('//cdn.datatables.net/plug-ins/1.10.16/i18n/Italian.json');	
	$scope.dtColumnDefs = [          
		DTColumnDefBuilder.newColumnDef(4).notSortable()
	];

	// START PUBLIC FUNCTIONS

	//funzione che recupera la lista di tutti gli utenti
	$scope.getUserList = function (){
		//invocazione service
		UserService.getUserList().then(function(response) {  
	    	if(response!=null && response.data != null){
	    		$scope.users = response.data;	    		
	    	}    	
	    });		
	}
	
	//funzione che recupera la lista dei clienti con parametri di ricerca
	$scope.getAdvSearchUsersList = function (){
		UserService.getAdvSearchUsersList($scope.filters).then(function(response) { 
			//invocazione service
			if(response!=null && response.data != null){
	    		$scope.users = response.data.utenti;	    		
	    	}
	    });
	}

	//open modale di inserimento utente
	$scope.openModalNewUser = function () {
		$scope.transient.newUser = {};
		$uibModal.open({
		templateUrl: './html/users/modalNewUser.html',
		scope:$scope,	
		backdrop:'static',	
		controller: function ($scope, $uibModalInstance) {
			$scope.createNewUserButton = function () {
				createNewUser($uibModalInstance);
			};		
			$scope.cancelNewUserButton = function () {
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
	
	//recupero utente ById e apertura modale di modifica
	$scope.openModalEditUser = function (p_id) {
		//recupero utente
		UserService.getUserById(p_id).then(function(response) {  
	    	//var handleResponseResult = $scope.handleResponse(response);  
	    	//if(handleResponseResult.next){
			if(response!=null && response.data != null){
				$scope.transient.editUser = response.data[0].us_utenti;	    
				$scope.transient.editUser.IDPROFILO = ''+ $scope.transient.editUser.IDPROFILO;		
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}   	
	    });	

		//apertura modale
		$uibModal.open({
		templateUrl: './html/users/modalEditUser.html',
		scope:$scope,	
		backdrop:'static',	
		controller: function ($scope, $uibModalInstance) {			
			$scope.editUserButton = function () {
				editNewUser($uibModalInstance);
			};		
			$scope.cancelEditUserButton = function () {
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

	
	$scope.askConfirmationDelete = function(p_id) {
    var message = "Sei sicuro di voler eliminare questo utente?";
    var modalHtml = '<div class="modal-body">' + message + '</div>';
    modalHtml += '<div class="modal-footer"><button class="btn btn-primary" ng-click="confirmDeleteUtente()">OK</button><button class="btn btn-warning" ng-click="cancelDelete()">Cancel</button></div>';

    $uibModal.open({
		template: modalHtml,
		scope:$scope,
		backdrop:'static',		
		controller: function ($scope, $uibModalInstance) {
			$scope.confirmDeleteUtente = function () {
				$scope.removeUser(p_id);
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


	$scope.removeUser = function (p_id){
		console.log("removeUser = " + p_id);
		UserService.removeUser(p_id).then(function(response) {  
	    	if(response!=null && response.data != null){
				console.log("utente eliminato "); 
				$scope.getUserList(); 		
	    	}    	
	    });				
	}

	// END PUBLIC FUNCTIONS

	//init page
    $scope.getUserList();
	
	//private functions
	function createNewUser($uibModalInstance){
		console.log("createNewUser");	
		//adding default values
		$scope.transient.newUser.password="temp";		
		$scope.transient.newUser.enabled=1;
		$scope.transient.newUser.force_change_pwd=1;
		UserService.createUser($scope.transient.newUser).then(function(response) {  
	    	var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				console.log("utente creato"); 
				$uibModalInstance.dismiss('cancel');
				toastr.success("Utente creato correttamente");
				$scope.getUserList(); 		
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}    	
		});
	}

	function editNewUser($uibModalInstance){
		console.log("editNewUser");	
		
		UserService.updateUser($scope.transient.editUser).then(function(response) {  
	    	var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				console.log("utente modificato"); 
				$uibModalInstance.dismiss('cancel');
				toastr.success("Utente modificato correttamente");
				$scope.getUserList(); 		
	    	} else {
				console.error("errore modifica utente");
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );				
			}    	
		});
	}

	//Gestione tasto invio su ricerca cliente
	$scope.gotoSearch = function(event) {
		if(event.keyCode == 13) {
			$scope.getAdvSearchUsersList();
		}
	}
	
}]);

