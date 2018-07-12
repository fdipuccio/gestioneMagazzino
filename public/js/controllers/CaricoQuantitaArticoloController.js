angular.module("gestionaleApp")
.controller("CaricoQuantitaArticoloController",
 ['$scope','$uibModal','$uibModalInstance','filterFilter','$sessionStorage','ArticoliService','CommonService', 'DTOptionsBuilder', 'DTColumnDefBuilder',
 function ($scope, $uibModal, $uibModalInstance, filterFilter, $sessionStorage, ArticoliService, CommonService, DTOptionsBuilder, DTColumnDefBuilder) {
	 'use strict';
	$scope.model ={};	
	$scope.articoli = [];
	$scope.persistent = {};
	$scope.persistent.idArticolo = "";		
	$scope.transient = {};
	$scope.transient.numeroScatoli = 0;
	$scope.transient.listaScatoli = [];

	// START PUBLIC FUNCTIONS

	$scope.createNewArticoloButton = function () {
				createNewArticolo($uibModalInstance);
			};		
	$scope.cancelCaricoArticoloButton = function () {
		//$uibModalInstance.close(false);
		$uibModalInstance.dismiss('cancel');		
	};

	

	
	// END PUBLIC FUNCTIONS

	//init page
	
		
	//private functions
	function createNewArticolo($uibModalInstance){
		console.log("createNewArticolo");	
		//adding default values
		ArticoliService.createArticolo($scope.transient.newArticolo).then(function(response) { 
			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				console.log("articolo creato");  
				$uibModalInstance.dismiss('cancel'); 
				if($scope.sezioneRichiamante == 'articoli'){
					$scope.getAdvSearchArticoliList(); 
				} 
						
	    	} else {
				if(handleResponseResult.errorCode == 'ART002'){
					toastr.warning("ARTICOLO GIA PRESENTE");
				} else {
					toastr.error("ERRORE ARTICOLO GENERICO");		
				}
						
			}    	 
		});
	}


	$scope.$watch("transient.numeroScatoli", function(newValue, oldValue) {
		 
		$scope.transient.listaScatoli = [];
		
		 for(var i = 0; i< newValue;i++){
			 var scatolo = {};
			
			$scope.transient.listaScatoli.push(scatolo);
		 }

    
});

}]);
